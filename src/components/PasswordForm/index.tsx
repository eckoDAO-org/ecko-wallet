import styled from 'styled-components';
import { Control, Controller, FieldValues, UseFormClearErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { BaseTextInput, InputAlert, InputError } from 'src/baseComponent';
import { Radio } from 'src/components/Radio';

const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 16px;
  line-height: 40px;
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

interface PasswordFormProps {
  clearErrors: UseFormClearErrors<FieldValues>,
  control: Control<FieldValues, object>,
  errors: { [x: string]: any; },
  getValues: UseFormGetValues<FieldValues>,
  register: UseFormRegister<FieldValues>,
  setValue: UseFormSetValue<FieldValues>,
}

export const PasswordForm = ({ clearErrors, control, errors, getValues, register, setValue }: PasswordFormProps) => {
  const checkPasswordDiscouraged = (str) => {
    // Check if there are characters that are NOT:
    // \w words (letters, digits, underscore)
    // !?"'.,;@# special characters
    const pattern = /[^\w!?"'.,;@#]/;
    return pattern.test(str);
  };

  const password = getValues('password');
  const passwordIsDiscouraged = checkPasswordDiscouraged(password);

  return (
    <>
      <DivBody>
        <BaseTextInput
          inputProps={{
            type: 'password',
            placeholder: 'Input Password',
            ...register('password', {
              required: {
                value: true,
                message: 'This field is required.',
              },
              minLength: {
                value: 8,
                message: 'Password should be minimum 8 characters.',
              },
              maxLength: {
                value: 256,
                message: 'Password should be maximum 256 characters.',
              },
            }),
          }}
          typeInput="password"
          title="New Password (min 8 chars)"
          height="auto"
          onChange={(e) => {
            clearErrors('password');
            setValue('password', e.target.value);
          }}
        />
      </DivBody>
      {errors.password && (
        <InputError>
          {errors.password.message}
        </InputError>
      )}
      <DivBody>
        <BaseTextInput
          inputProps={{
            type: 'password',
            placeholder: 'Input Confirm Password',
            ...register('confirmPassword', {
              required: {
                value: true,
                message: 'This field is required.',
              },
              maxLength: {
                value: 256,
                message: 'Password should be maximum 256 characters.',
              },
              validate: {
                match: (v) => v === getValues('password') || 'Password does not match',
              },
            }),
          }}
          typeInput="password"
          title="Confirm Password"
          height="auto"
          onChange={(e) => {
            clearErrors('confirmPassword');
            setValue('confirmPassword', e.target.value);
          }}
        />
      </DivBody>
      {errors.confirmPassword && (
        <InputError>
          {errors.confirmPassword.message}
        </InputError>
      )}
      <DivBody>
        {passwordIsDiscouraged && (
          <Controller
            control={control}
            name="passwordDiscouragedConfirm"
            rules={{
              required: {
                value: true,
                message: 'This field is required.',
              },
            }}
            render={({
              field: { value, name },
            }) => (
              <Radio
                onClick={() => setValue(name, !value)}
                isChecked={value}
                label={
                  <InputAlert>
                    I understand that I used characters that are unsafe. It is strongly recommended to use only letters(a-z), numbers(0-9), and special characters _!?&quot;&apos;.#@,;-
                  </InputAlert>
                }
              />
            )}
          />
        )}
      </DivBody>
      {errors.passwordDiscouragedConfirm && (
        <InputError>
          {errors.passwordDiscouragedConfirm.message}
        </InputError>
      )}
    </>
  );
};
