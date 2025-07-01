import { Provider } from "next-auth/providers";
import { createTransport } from "nodemailer";

interface Params {
  provider: any;
  identifier: any;
  host: any;
  subject: string;
  text: string;
  html: string;
}

export default async function sendMail({
  provider,
  identifier,
  host,
  subject,
  text,
  html,
}: Params) {
  const transport = createTransport(provider.server);

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transport.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  await new Promise((resolve, reject) => {
    // send mail
    transport.sendMail(
      {
        to: identifier,
        from: provider.from,
        subject,
        text,
        html,
      },
      (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      }
    );
  });
}
