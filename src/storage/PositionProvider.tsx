import { createContext, useReducer, useEffect } from 'react';
const positionProviderActions = {
  // SET_POSITION: "SET_POSITION",
  // RESET_POSITION: "RESET_POSITION",
  SET_POSITION: (pos: string | null) =>
    /** @type {const} */ ({
      type: 'SET_POSITION',
      payload: pos,
    }) as const,
  RESET_POSITION: () =>
    /** @type {const} */ ({
      type: 'RESET_POSITION',
      payload: null,
    }) as const,
};

const POSITION_KEY = 'selected_position_key';

const initialState = JSON.parse(localStorage.getItem(POSITION_KEY)!)
  ? JSON.parse(localStorage.getItem(POSITION_KEY)!)
  : {
      selectedPosition: null,
    };

const positionReducer = (
  state: typeof initialState,
  action: ReturnType<
    (typeof positionProviderActions)[keyof typeof positionProviderActions]
  >,
) => {
  // const { type, payload } = action;
  switch (action.type) {
    case 'SET_POSITION':
      return { ...state, selectedPosition: action.payload };
    case 'RESET_POSITION':
      return { ...state, selectedPosition: null };
    default:
      return state;
  }
};

// Create context
export const PositionContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<
    ReturnType<
      (typeof positionProviderActions)[keyof typeof positionProviderActions]
    >
  >;
}>({
  state: initialState,
  dispatch: () => null,
});

// Create provider
export const PositionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(positionReducer, initialState);
  useEffect(() => {
    localStorage.setItem(POSITION_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <PositionContext.Provider value={{ state, dispatch }}>
      {children}
    </PositionContext.Provider>
  );
};
