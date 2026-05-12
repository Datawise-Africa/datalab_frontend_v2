import { useCallback, useEffect, useEffectEvent, useRef } from 'react';
import { useAppSelector } from '~/store';
import { useAppModal } from '~/store/slices/modal-slice';

/**
 * Queue an action for "log-in-then-run" flows.
 *
 * If the user is already authenticated, calling the returned `queue(arg)`
 * runs the action immediately. Otherwise the arg is stashed and the auth
 * modal is opened — once auth state flips to true, the action is replayed
 * with the original arg.
 *
 * Use this for actions that are mutations rather than other modals (e.g.
 * toggling a bookmark). For "open another modal after login", prefer the
 * `next` intent on the auth modal — see `AuthModal`.
 */
export function useResumeAfterAuth<TArg = void>(
  action: (arg: TArg) => void
): (arg: TArg) => void {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authModal = useAppModal('auth');
  const pendingRef = useRef<{ arg: TArg } | null>(null);

  const runAction = useEffectEvent((arg: TArg) => action(arg));

  useEffect(() => {
    if (!isAuthenticated) return;
    const queued = pendingRef.current;
    if (!queued) return;
    pendingRef.current = null;
    runAction(queued.arg);
    // runAction is a useEffectEvent — intentionally excluded per React docs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return useCallback(
    (arg: TArg) => {
      if (isAuthenticated) {
        runAction(arg);
        return;
      }
      pendingRef.current = { arg };
      authModal.open();
    },
    // runAction is a useEffectEvent — intentionally excluded per React docs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, authModal]
  );
}
