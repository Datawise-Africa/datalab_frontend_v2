import { useContext, createContext, useReducer, useCallback, useEffect ,useMemo} from "react";
import PropTypes from 'prop-types';
import { Cookie } from "../lib/auth/actions";
import { useAuthModal } from "../hooks/useAuthModal";

/**@type {import('./../lib/auth/actions').AuthState} */
const initialState = {
  userId: Cookie.get("session_user_id") ?? null,
  userRole: Cookie.get("session_userrole") ?? null,
  accessToken: Cookie.get("session_access_token") ?? null,
  refreshToken: Cookie.get("session_refresh_token") ?? null,
  firstName: Cookie.get("session_first_name") ?? null,
  lastName: Cookie.get("session_last_name") ?? null,
};

const actions = {
  /**
   *
   * @param {string} userId
   * @param {string} userRole
   * @param {string} accessToken
   * @param {string} refreshToken
   * @param {string} firstName
   * @param {string} lastName
   * @returns
   */
  LOGIN: (userId, userRole, accessToken, refreshToken, firstName,lastName) =>
    /** @type {const} */ ({
      type: "LOGIN",
      payload: {
        userId,
        userRole,
        accessToken,
        refreshToken,
        firstName,
        lastName
      },
    }),

  LOGOUT: () =>
    /** @type {const} */ ({
      type: "LOGOUT",
    }),
};
/**
 * @type {React.Context<{state:typeof initialState,authModal:typeof useAuthModal,actions:typeof actions,dispatch:React.Dispatch<ReturnType<(typeof actions)[keyof typeof actions]>>}>,ReturnType<(typeof actions)[keyof typeof actions]>>}
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
      
      return Object.keys(state).reduce((acc, key) => {
        acc[key] = null;
        return acc;
      }
      , {});
    }
    default:
      return state;
  }
}

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const authModal = useAuthModal();

  const syncState = useCallback(() => {
    Cookie.set("session_user_id", state.userId);
    Cookie.set("session_userrole", state.userRole);
    Cookie.set("session_access_token", state.accessToken);
    Cookie.set("session_refresh_token", state.refreshToken);
    Cookie.set("session_first_name", state.firstName);
    Cookie.set("session_last_name", state.lastName);
  }, [state]);
  const isAuthenticated = useMemo(() => {
    return !!state.userId && !!state.accessToken;
  }
  , [state.userId, state.accessToken]);

  useEffect(() => {
    syncState();
  }, [state, syncState]);

  return (
    <AuthContext.Provider value={{ state, dispatch, actions,authModal,isAuthenticated }}>
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