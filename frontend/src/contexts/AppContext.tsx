/**
 * AppContext — minh hoạ Context API + useReducer (Roadmap mục 3)
 * Quản lý thông báo toàn cục và trạng thái loading chung của app
 */
import React, { createContext, useContext, useReducer } from 'react';

// --- State & Action types ---
interface AppState {
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  globalLoading: boolean;
}

type AppAction =
  | { type: 'SHOW_NOTIFICATION'; payload: AppState['notification'] }
  | { type: 'HIDE_NOTIFICATION' }
  | { type: 'SET_LOADING'; payload: boolean };

// --- Reducer (useReducer — Roadmap mục 3) ---
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return { ...state, notification: action.payload };
    case 'HIDE_NOTIFICATION':
      return { ...state, notification: null };
    case 'SET_LOADING':
      return { ...state, globalLoading: action.payload };
    default:
      return state;
  }
};

const initialState: AppState = {
  notification: null,
  globalLoading: false,
};

// --- Context (createContext — Roadmap mục 3) ---
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  showNotification: (message: string, type?: AppState['notification']['type']) => void;
  hideNotification: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// --- Provider ---
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const showNotification = (
    message: string,
    type: AppState['notification']['type'] = 'info'
  ) => dispatch({ type: 'SHOW_NOTIFICATION', payload: { message, type } });

  const hideNotification = () => dispatch({ type: 'HIDE_NOTIFICATION' });

  return (
    <AppContext.Provider value={{ state, dispatch, showNotification, hideNotification }}>
      {children}
      {/* Global notification banner */}
      {state.notification && (
        <div
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            padding: '12px 20px', borderRadius: 10, color: '#fff', fontWeight: 600,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            background:
              state.notification.type === 'success' ? '#3BB77E'
              : state.notification.type === 'error' ? '#ef4444'
              : '#3b82f6',
          }}
        >
          {state.notification.message}
          <button
            onClick={hideNotification}
            style={{ marginLeft: 12, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
};

// --- Custom Hook (useContext — Roadmap mục 3) ---
export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext phải được dùng bên trong <AppProvider>');
  return ctx;
};
