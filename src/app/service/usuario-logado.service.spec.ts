import { TestBed } from '@angular/core/testing';
import { UsuarioLogadoService } from './usuario-logado.service';
import { TokenService } from './token.service';

class TokenServiceStub {
  setTokenLogin(token: string) {
    localStorage.setItem('tokenLogin', token);
  }
  getUserFromToken() {
    return null;
  }
  removeTokenLogin() {
    localStorage.removeItem('tokenLogin');
  }
}

describe('UsuarioLogadoService', () => {
  let service: UsuarioLogadoService;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsuarioLogadoService,
        { provide: TokenService, useClass: TokenServiceStub },
      ],
    });
    service = TestBed.inject(UsuarioLogadoService);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should store token in localStorage', () => {
    service.setUsuarioLogado('abc');
    expect(localStorage.getItem('tokenLogin')).toBe('abc');
  });

  it('should retrieve decoded user from token service', () => {
    spyOn(tokenService, 'getUserFromToken').and.returnValue({ name: 'john' });
    const user = service.getUsuarioLogado();
    expect(tokenService.getUserFromToken).toHaveBeenCalled();
    expect(user).toEqual({ name: 'john' });
  });

  it('should return null if token service returns null', () => {
    spyOn(tokenService, 'getUserFromToken').and.returnValue(null);
    expect(service.getUsuarioLogado()).toBeNull();
  });

  it('should remove token on logout', () => {
    localStorage.setItem('tokenLogin', 'abc');
    service.logout();
    expect(localStorage.getItem('tokenLogin')).toBeNull();
  });
});

