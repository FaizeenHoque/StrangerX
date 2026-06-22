import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, cookies }) => {
    const token = cookies.get("access_token");

    if (token) {
        const res = await fetch("https://auth.hackclub.com/api/v1/me", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            throw redirect(302, "/matchmaking");
        }

        cookies.delete("access_token", { path: "/" });
        cookies.delete("refresh_token", { path: "/" });
    }
};