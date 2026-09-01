
export async function sendNtfyNotification(
    topic: string,
    title: string,
    message: string
) {
    const ntfyServer = import.meta.env.VITE_NTFY_SERVER;
    if (!ntfyServer) {
        throw new Error("VITE_NTFY_SERVER environment variable is not set");
    }
    
    const response = await fetch(`${ntfyServer}/${topic}`, {
        method: "POST",
        body: message,
        headers: {
            Title: title,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to send ntfy notification");
    }
}