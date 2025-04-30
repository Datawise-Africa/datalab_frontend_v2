import { useContext, createContext, useReducer, useCallback, useEffect } from "react";
import PropTypes from 'prop-types';
import { Cookie } from "../lib/auth/actions";

/**@type {import('./../lib/auth/actions').AuthState} */
const initialState = {
  userId: Cookie.get("session_user_id") ?? null,
  userRole: Cookie.get("session_userrole") ?? null,
  accessToken: Cookie.get("session_access_token") ?? null,
  refreshToken: Cookie.get("session_refresh_token") ?? null,
  firstName: Cookie.get("session_first_name") ?? null,
};

const actions = {
  /**
   *
   * @param {string} userId
   * @param {string} userRole
   * @param {string} accessToken
   * @param {string} refreshToken
   * @param {string} firstName
   * @returns
   */
  LOGIN: (userId, userRole, accessToken, refreshToken, firstName) =>
    /** @type {const} */ ({
      type: "LOGIN",
      payload: {
        userId,
        userRole,
        accessToken,
        refreshToken,
        firstName,
      },
    }),

  LOGOUT: () =>
    /** @type {const} */ ({
      type: "LOGOUT",
    }),
};
/**
 * @type {React.Context<{state:typeof initialState,actions:typeof actions,dispatch:React.Dispatch<ReturnType<(typeof actions)[keyof typeof actions]>>}>,ReturnType<(typeof actions)[keyof typeof actions]>>}
 */
const AuthContext = createContext({});
/**
 * @param {typeof initialState} state
 * @param {ReturnType<(typeof actions)[keyof typeof actions]>} action
 * @returns {typeof initialState}
 */
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "LOGOUT": {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const syncState = useCallback(() => {
    Cookie.set("session_user_id", state.userId);
    Cookie.set("session_userrole", state.userRole);
    Cookie.set("session_access_token", state.accessToken);
    Cookie.set("session_refresh_token", state.refreshToken);
    Cookie.set("session_first_name", state.firstName);
  }, [state]);

  useEffect(() => {
    syncState();
  }, [state, syncState]);

  return (
    <AuthContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AuthContext.Provider>
  );
};


const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { AuthProvider, useAuth };