
/**
createWebsite() : creating a website in the Database
getWebsites() : getting a website using userId
getWebsiteById() : get a specific Wbsite using UserId and websiteId
updateWebsite() : for updating the website details 
deleteWebsite() : for deleting a website from the records
pauseWebsite() : for pause monitoring a website  
resumeWebsite() : for resuming a website 
 */

import { prismaClient, HttpMethod } from "@watchtower/db";


// schema for creating a website
interface CreateWebsiteInput {
    name: string;
    url: string;

    method?: HttpMethod;
    intervalSeconds?: number;
    timeoutMs?: number;
    expectedStatusCode?: number;

    regionIds: string[];
}

// schema for updating a website
interface UpdateWebsiteInput {
    name?: string;
    url?: string;
    method?: HttpMethod;
    intervalSeconds?: number;
    timeoutMs?: number;
    expectedStatusCode?: number;
}

// creating a website in the Database
export async function createWebsite( userId: string, input: CreateWebsiteInput) {

    
    const regions = await prismaClient.region.findMany({
        where: {
            id: {
                in: input.regionIds
            },
            enabled: true
        }
    });

    // If user sent 3 region IDs but only 2 valid regions were found,
    // at least one region ID is invalid/disabled.
    if (regions.length !== input.regionIds.length) {
        throw new Error("One or more regions are invalid or disabled");
    }

    const website = await prismaClient.website.create({
        data: {
            name: input.name,
            url: input.url,

            method: input.method,
            intervalSeconds: input.intervalSeconds,
            timeoutMs: input.timeoutMs,
            expectedStatusCode: input.expectedStatusCode,

            userId,

            regions: {
                create: input.regionIds.map((regionId) => ({
                    regionId
                }))
            }
        },

        include: {
            regions: {
                include: {
                    region: true
                }
            }
        }
    });

    return website;
}


// for fetching the website from the backend
export async function getWebsites(userId: string) {
    const websites = await prismaClient.website.findMany({
        where: {
            userId
        },
        include: {
            regions: {
                include: {
                    region: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return websites;
}


// get a specific website using userId and websiteId (for loggedin user)
export async function getWebsiteById( userId: string, websiteId: string ) {
    const website = await prismaClient.website.findFirst({
        where: {
            id: websiteId,
            userId
        },
        include: {
            regions: {
                include: {
                    region: true
                }
            }
        }
    });

    if (!website) {
        throw new Error("Website not found");
    }

    return website;
}


export async function updateWebsite( userId: string, websiteId: string, input: UpdateWebsiteInput) {
    
    // Make sure the website exists AND belongs to this user
    const website = await prismaClient.website.findFirst({
        where: {
            id: websiteId,
            userId
        }
    });

    if (!website) {
        throw new Error("Website not found");
    }

    // Update the website
    const updatedWebsite = await prismaClient.website.update({
        where: {
            id: websiteId
        },

        data: {
            name: input.name,
            url: input.url,
            method: input.method,
            intervalSeconds: input.intervalSeconds,
            timeoutMs: input.timeoutMs,
            expectedStatusCode: input.expectedStatusCode
        }
    });

    return updatedWebsite;
}

export async function deleteWebsite(  userId: string,  websiteId: string) {
    const website = await prismaClient.website.findFirst({
        where: {
            id: websiteId,
            userId
        }
    });

    if (!website) {
        throw new Error("Website not found");
    }

    // Delete the website
    await prismaClient.website.delete({
        where: {
            id: websiteId
        }
    });

    return {
        message: "Website deleted successfully"
    };
}

export async function pauseWebsite(  userId: string, websiteId: string) {
    // Check ownership
    const website = await prismaClient.website.findFirst({
        where: {
            id: websiteId,
            userId
        }
    });

    if (!website) {
        throw new Error("Website not found");
    }

    // Pause monitoring
    const pausedWebsite = await prismaClient.website.update({
        where: {
            id: websiteId
        },
        data: {
            monitorStatus: "PAUSED"
        }
    });

    return pausedWebsite;
}


export async function resumeWebsite( userId: string, websiteId: string) {
    
    // Check that the website exists and belongs to this user
    const website = await prismaClient.website.findFirst({
        where: {
            id: websiteId,
            userId
        }
    });

    if (!website) {
        throw new Error("Website not found");
    }

    // Resume monitoring
    const resumedWebsite = await prismaClient.website.update({
        where: {
            id: websiteId
        },
        data: {
            monitorStatus: "ACTIVE"
        }
    });

    return resumedWebsite;
}