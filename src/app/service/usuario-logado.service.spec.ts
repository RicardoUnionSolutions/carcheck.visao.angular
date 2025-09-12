import { TestBed } from '@angular/core/testing';
import { UsuarioLogadoService } from './usuario-logado.service';
import { TokenService } from './token.service';

describe('UsuarioLogadoService', () => {
  let service: UsuarioLogadoService;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsuarioLogadoService,
        TokenService,
      ],
    });
    service = TestBed.inject(UsuarioLogadoService);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should store token using token service', () => {
    const spy = spyOn(tokenService, 'setToken');
    service.setUsuarioLogado('abc');
    expect(spy).toHaveBeenCalledWith('abc');
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
    const spy = spyOn(tokenService, 'removeToken');
    service.logout();
    expect(spy).toHaveBeenCalled();
  });
});

