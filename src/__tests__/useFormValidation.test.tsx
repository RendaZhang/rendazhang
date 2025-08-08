import { renderHook, act } from '@testing-library/react';
import useFormValidation from '../hooks/useFormValidation';

describe('useFormValidation', () => {
  const initialValues = { username: '', agree: false };
  const validators = {
    username: (value: string) => (value ? '' : 'Required'),
    agree: (value: boolean) => (value ? '' : 'Must agree')
  } as const;

  it('updates values and errors on handleChange', () => {
    const { result } = renderHook(() => useFormValidation(initialValues, validators));

    act(() => result.current.handleChange('username', ''));
    expect(result.current.values.username).toBe('');
    expect(result.current.errors.username).toBe('Required');

    act(() => result.current.handleChange('username', 'Alice'));
    expect(result.current.values.username).toBe('Alice');
    expect(result.current.errors.username).toBe('');
  });

  it('validates all fields and returns boolean', () => {
    const { result } = renderHook(() => useFormValidation(initialValues, validators));

    let success: boolean | undefined;
    act(() => {
      success = result.current.validateAll();
    });
    expect(success).toBe(false);
    expect(result.current.errors).toEqual({ username: 'Required', agree: 'Must agree' });

    act(() => {
      result.current.handleChange('username', 'Alice');
      result.current.handleChange('agree', true);
    });

    act(() => {
      success = result.current.validateAll();
    });
    expect(success).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('resets values and errors', () => {
    const { result } = renderHook(() => useFormValidation(initialValues, validators));

    act(() => {
      result.current.handleChange('username', 'Alice');
      result.current.handleChange('agree', true);
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });
});
