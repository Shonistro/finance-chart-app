import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isTokenValid', () => {
    function createJwt(payload: object): string {
      const base64 = (obj: object) => btoa(JSON.stringify(obj));
      return [
        'header',
        base64(payload),
        'signature',
      ].join('.');
    }

    it('should return true for a valid (not expired) token', () => {
      const future = Math.floor(Date.now() / 1000) + 3600;
      const token = createJwt({ exp: future });
      expect(service.isTokenValid(token)).toBeTrue();
    });

    it('should return false for an expired token', () => {
      const past = Math.floor(Date.now() / 1000) - 3600;
      const token = createJwt({ exp: past });
      expect(service.isTokenValid(token)).toBeFalse();
    });

    it('should return false for a token with invalid format', () => {
      expect(service.isTokenValid('invalid.token')).toBeFalse();
    });

    it('should return false for a token with invalid payload', () => {
      const token = 'header.invalidbase64.signature';
      expect(service.isTokenValid(token)).toBeFalse();
    });
  });
});
