'use server';

import { withAction } from "@/lib/wrapper/with-action";

export async function verifyFeatureAccessCode(accessCode: string) {
    return withAction<boolean>(async () => {
        if (accessCode === process.env.FEATURE_ACCESS_CODE) {
            return true;
		}
		return false;
	}, false);
}