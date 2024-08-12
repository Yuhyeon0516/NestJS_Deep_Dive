import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * 토큰을 사용하는 방식
   *
   * 1. 사용자가 로그인 또는 회원가입을 진행하면
   *    accessToken과 refreshToken을 발급받는다.
   * 2. 로그인 할때는 Basic Token과 함께 요청을 보낸다.
   *    Basic Token은 '이메일:비밀번호'를 Base64로 인코딩한 형태
   *    예) { authorization: 'Basic {token}' }
   * 3. 아무나 접근 할 수 없는 정보(private route)를 접근 할때는
   *    accessToken을 Header에 추가하여 요청한다.
   *    예) { authorization: 'Bearer {token}' }
   * 4. 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해
   *    현재 요청을 보낸 사용자가 누구인지 알 수 있다.
   *    예) 현재 로그인한 사용자가 작성한 포스트만 가져오려면
   *        토큰의 sub 값에 입력되어있는 사용자의 포스트만 따로 필터링이 가능함
   *        특정 사용자의 토큰이 없다면 다른 사용자의 데이터에는 접근하지 못한다.
   * 5. 모든 토큰은 만료 기간이 있다.
   *    만료 기간이 지나면 새로 토큰을 발급받아야한다.
   *    그렇지않으면 jwtService.verify()에서 인증이 통과 안된다.
   *    그러니 accessToken을 새로 발급 받을 수 있는 route와 refreshToken을 새로 발급 받을 수 있는 route가 필요하다.
   * 6. 토큰이 만료되면 각각의 토큰을 새로 발급 받을 수 있는 엔드포인트에 요청을 해서
   *    새로운 토큰을 발급받고 새로운 토큰을 사용해서 private route에 접근한다.
   */

  /**
   * Header로 부터 토큰을 받을 때는 Basic과 Bearer 두가지이다.
   */
  extractTokenFromHeader(authorizationValue: string, isBearer: boolean) {
    const splitToken = authorizationValue.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix)
      throw new UnauthorizedException('잘못된 토큰입니다.');

    const token = splitToken[1];

    return token;
  }

  /**
   * Basic dfshjfhajkfdhfdkjsfsdhajds
   *
   * 1. base64로 인코딩된것을 email:password 형태로 디코딩함
   * 2. 디코딩 된 email:password를 [email, password]로 split하고
   * 3. split한 배열을 {email: email, password: password} 구조의 객체로 return
   */
  decodeBasicToken(base64Token: string) {
    const decoded = Buffer.from(base64Token, 'base64').toString('utf8');

    const split = decoded.split(':');

    if (split.length !== 2)
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');

    const [email, password] = split;

    return {
      email,
      password,
    };
  }

  /**
   * Token 검증
   */
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('토큰이 만료되었거나 잘못된 토큰입니다.');
    }
  }

  /**
   *
   */
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);

    /*
     * sub: id
     * email: email
     * type: 'access' or 'refresh'
     */
    if (decoded.type !== 'refresh')
      throw new UnauthorizedException(
        '토큰 재발급은 Refresh 토큰으로만 가능합니다.',
      );

    return this.signToken(
      {
        ...decoded,
        id: decoded.sub,
      },
      isRefreshToken,
    );
  }

  /*
   * 만들 기능
   * 1. registerWithEmail
   *  - email, nickname, password를 입력받고 유저를 생성.
   *  - 생성이 완료되면 accessToken과 refreshToken을 반환한다.
   *    - 회원가입 후 다시 로그인해주세요 <- 이런건 UX상 정말 쓸데없음
   *
   * 2. loginWithEmail
   *  - email, password를 입력하면 사용자 검증
   *  - 검증이 완료되면 accessToken과 refreshToken을 반환한다.
   *
   * 3. loginUser
   *  - 1과 2에서 필요한 accessToken과 refreshToken을 반환하는 로직
   *
   * 4. signToken
   *  - 3에서 필요한 accessToken과 refreshToken을 발급하는 로직
   *
   * 5. authenticateWithEmailAndPassword
   *  - 2에서 로그인을 진행할때 필요한 기본적인 검증 진행
   *    - email 기반으로 사용자가 존재하는지 확인
   *    - 비밀번호가 맞는지 확인
   *    - 모두 통과되면 찾은 사용자 정보 반환
   *  - 이후 loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   */

  /*
   * payload에 들어갈 정보
   * 1. email
   * 2. sub -> 보통은 id
   * 3. type -> 'access' or 'refresh'
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser)
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');

    // compare(입력받은 비밀번호, hash된 비밀번호)
    const passwordOk = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!passwordOk) throw new UnauthorizedException('비밀번호가 틀렸습니다.');

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  async registerWithEmail(
    user: Pick<UsersModel, 'email' | 'nickname' | 'password'>,
  ) {
    const hashedPassword = await bcrypt.hash(user.password, HASH_ROUNDS);

    const newUser = await this.usersService.createUser({
      ...user,
      password: hashedPassword,
    });

    return this.loginUser(newUser);
  }
}
