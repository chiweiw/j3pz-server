import { Service } from '@tsed/common';
import { Transporter, createTransport } from 'nodemailer';
import { WelcomeTemplate } from '../utils/mails/WelcomeTemplate';
import { User } from '../entities/users/User';

@Service()
export class MailService {
    private transporter: Transporter;

    public constructor() {
        const connect = {
            host: 'smtpdm.aliyun.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        };
        this.transporter = createTransport(connect);
    }

    public sendWelcomeMail(user: User): void {
        const template = new WelcomeTemplate({
            title: '欢迎注册剑网3配装器',
            name: user.name,
            permalink: user.uid,
            token: user.activation.verifyToken,
        });
        this.transporter.sendMail({
            to: `"${user.name}" <${user.email}>`,
            from: `"剑网3配装器用户服务" <${process.env.MAIL_ADDRESS}>`,
            subject: '欢迎注册剑网3配装器',
            replyTo: '"剑网3配装器用户服务" <service@j3pz.com>',
            html: template.html(),
            text: template.text(),
        });
    }
}
