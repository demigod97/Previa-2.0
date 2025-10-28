// Chakra UI Label (FormLabel) component
import { FormLabel, FormLabelProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface LabelProps extends FormLabelProps {
  children: ReactNode;
  htmlFor?: string;
}

export const Label = ({ children, htmlFor, ...props }: LabelProps) => (
  <FormLabel htmlFor={htmlFor} {...props}>
    {children}
  </FormLabel>
);
