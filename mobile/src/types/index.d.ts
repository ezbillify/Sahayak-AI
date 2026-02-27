/// <reference types="react" />
/// <reference types="react-native" />

declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class Icon extends Component<IconProps> {}
}

declare module 'react-native-document-picker' {
  export interface DocumentPickerResponse {
    uri: string;
    type: string | null;
    name: string | null;
    size: number | null;
  }

  export const types: {
    allFiles: string;
    images: string;
    plainText: string;
    audio: string;
    pdf: string;
    zip: string;
    csv: string;
    doc: string;
    docx: string;
    ppt: string;
    pptx: string;
    xls: string;
    xlsx: string;
  };

  export function pick(options?: any): Promise<DocumentPickerResponse[]>;
  export function pickSingle(options?: any): Promise<DocumentPickerResponse>;
  export function isCancel(error: any): boolean;
}

declare module '@react-native-picker/picker' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface PickerProps extends ViewProps {
    selectedValue?: any;
    onValueChange?: (itemValue: any, itemIndex: number) => void;
    enabled?: boolean;
  }

  export interface PickerItemProps {
    label: string;
    value: any;
    color?: string;
  }

  export class Picker extends Component<PickerProps> {
    static Item: Component<PickerItemProps>;
  }
}
