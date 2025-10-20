import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { AuthProvider as _AuthProvider } from './authContext';
export default _AuthProvider;
