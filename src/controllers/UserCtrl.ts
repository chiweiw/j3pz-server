import {
    Controller, Get, Req, PathParams, Post,
} from '@tsed/common';
import { Summary } from '@tsed/swagger';
import { Authenticate } from '@tsed/passport';
import { UserService } from '../services/UserService';
import { UserInfoResource } from '../model/Credentials';
import { Resource, Status } from '../model/Server';
import { ActivatedError } from '../utils/errors/Forbidden';
import { MailService } from '../services/MailService';

@Controller('/user')
export class UserCtrl {
    public constructor(
        private userService: UserService,
        private mailService: MailService,
    ) {}

    @Get()
    @Summary('获取用户信息')
    @Authenticate('jwt', { failWithError: true })
    public async userInfo(@Req() req: Req): Promise<UserInfoResource> {
        const token = this.userService.sign(req.user);
        const info = this.userService.redact(req.user, token);
        return new Resource(info.uid, 'User', info);
    }

    @Get('/verify/:permalink/:token')
    @Summary('邮箱验证')
    @Authenticate(['jwt', 'anonymous'])
    public async verify(
        @Req() req: Req,
        @PathParams('permalink') permalink: string,
        @PathParams('token') token: string,
    ): Promise<UserInfoResource> {
        const user = await this.userService.verify(permalink, token);
        const jwt = this.userService.sign(user);
        const userInfo = this.userService.redact(user, jwt);
        return new Resource(user.uid, 'User', userInfo);
    }

    @Post('/verify')
    @Summary('重发邮箱验证')
    @Authenticate('jwt', { failWithError: true })
    public async resend(@Req() req: Req): Promise<Status> {
        if (req.user.activation.activate) {
            throw new ActivatedError(req.user.email);
        }
        this.mailService.sendWelcomeMail(req.user);
        return new Status(true);
    }
}
