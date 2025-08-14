import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
    to,
    subject,
    text,
}: {
    to: string;
    subject: string;
    text: string;
}) {
    const { data, error } = await resend.emails.send({
        from: "ConnectHub <noreply@connecthub.com>",
        to,
        subject,
        text,
    });
    
    if (error) {
        console.error(error);
        throw new Error("Failed to send email");
    }

    return data;
}