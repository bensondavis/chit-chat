import { create } from "zustand";

const useCall = create((set, get) => ({
  open: false,
  setOpen: (open) => set({ open }),
  stream: null,
  setStream: (stream) => set({ stream }),
  isVideoCall: false,
  setIsVideoCall: (isVideoCall) => set({ isVideoCall }),
  callerSignal: null,
  setCallerSignal: (callerSignal) => set({ callerSignal }),
}));

export default useCall;
