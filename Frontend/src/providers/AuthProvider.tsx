import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export { default as AuthProvider } from './authContext'; 
export { default } from './authContext';                 
export * from './authContext'; 
export * from './useAuth'; 