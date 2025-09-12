import { TestBed } from '@angular/core/testing';
import { UsuarioLogadoService } from './usuario-logado.service';
import { TokenService } from './token.service';

class TokenServiceStub {
  decodeToken() {
    return null;
  }
  saveToken(token: string) {}
  removeToken() {}
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

  it('should store token using token service', () => {
    spyOn(tokenService, 'saveToken');
    service.setUsuarioLogado('abc');
    expect(tokenService.saveToken).toHaveBeenCalledWith('abc');
  });

  it('should retrieve decoded user from token service', () => {
    spyOn(tokenService, 'decodeToken').and.returnValue({ name: 'john' });
    const user = service.getUsuarioLogado();
    expect(tokenService.decodeToken).toHaveBeenCalledWith();
    expect(user).toEqual({ name: 'john' });
  });

  it('should return null if token service returns null', () => {
    spyOn(tokenService, 'decodeToken').and.returnValue(null);
    expect(service.getUsuarioLogado()).toBeNull();
  });

  it('should remove token on logout', () => {
    spyOn(tokenService, 'removeToken');
    service.logout();
    expect(tokenService.removeToken).toHaveBeenCalled();
  });
});

