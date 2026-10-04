"use client";
import { createContext, useContext } from "react";
export const MotionPreference = createContext(true);
export const useExperienceMotion = () => useContext(MotionPreference);
