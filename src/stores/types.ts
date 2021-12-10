import store from '.';

export * from 'react-redux/index';

export type RootState = ReturnType<typeof store.getState>;

declare module 'react-redux' {
  export function useSelector<TSelected = unknown>(
    selector: (state: RootState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
  ): TSelected;
}
