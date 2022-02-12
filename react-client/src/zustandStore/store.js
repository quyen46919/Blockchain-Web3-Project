import create from 'zustand';

export const useStore = create(set => ({
    // authentication
    user: {},
    login: () => set(state => ({ bears: state })),
    logout: () => set({ bears: 0 }),
    // metamask info
    metamaskAddress: {},
    getAddress: () => set(state => ({ metamaskAddress: state }))
}));