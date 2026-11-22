
/**
createWebsite() : creating a website in the Database
getWebsites()
getWebsiteById()
updateWebsite()
deleteWebsite()
pauseWebsite()
resumeWebsite()
 */

import { prismaClient, HttpMethod } from "@watchtower/db";

interface CreateWebsiteInput {
    name: string;
    url: string;

    method?: HttpMethod;
    intervalSeconds?: number;
    timeoutMs?: number;
    expectedStatusCode?: number;

    regionIds: string[];
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