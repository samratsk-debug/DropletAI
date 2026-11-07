import React from 'react';
import { ContentUpload } from './ContentUpload';

// Keep the employee route, but share the same backend-backed submit workflow.
export const EmployeeWorkspace: React.FC = () => <ContentUpload />;
