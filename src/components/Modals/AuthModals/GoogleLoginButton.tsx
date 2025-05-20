import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
// import PropTypes from 'prop-types';

type GoogleLoginButtonProps = {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onError: () => void;
};

const GoogleLoginButton = ({ onSuccess, onError }: GoogleLoginButtonProps) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      // render={() => (
      //   // renderProps
      //   <button
      //     // onClick={renderProps.onClick}
      //     // disabled={renderProps.disabled}
      //     style={{
      //       backgroundColor: '#474060',
      //       color: '#fff',
      //       cursor: 'pointer',
      //     }}
      //   >
      //     Sign in With Google
      //   </button>
      // )}
    />
  );
};

// GoogleLoginButton.propTypes = {
//   onSuccess: PropTypes.func.isRequired,
//   onError: PropTypes.func.isRequired,
// };

export default GoogleLoginButton;
