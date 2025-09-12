import { TestBed } from '@angular/core/testing';
import { UsuarioLogadoService } from './usuario-logado.service';
import { TokenService } from './token.service';

describe('UsuarioLogadoService', () => {
  let service: UsuarioLogadoService;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuarioLogadoService, TokenService],
    });
    service = TestBed.inject(UsuarioLogadoService);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should store token in localStorage', () => {
    service.setUsuarioLogado('abc');
    expect(tokenService.getToken()).toBe('abc');
  });

  it('should retrieve decoded user from token service', () => {
    spyOn(tokenService, 'decodeToken').and.returnValue({ name: 'john' });
    const user = service.getUsuarioLogado();
    expect(tokenService.decodeToken).toHaveBeenCalled();
    expect(user).toEqual({ name: 'john' });
  });

  it('should return null if token service returns null', () => {
    spyOn(tokenService, 'decodeToken').and.returnValue(null);
    expect(service.getUsuarioLogado()).toBeNull();
  });

  it('should remove token on logout', () => {
    tokenService.setToken('abc');
    service.logout();
    expect(tokenService.getToken()).toBeNull();
  });
});

