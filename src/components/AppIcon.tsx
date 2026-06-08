import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

type Props = {
  icon: IconDefinition;
  color: string;
  size?: number;
};

export function AppIcon({icon, color, size = 18}: Props) {
  return <FontAwesomeIcon icon={icon} color={color} size={size} />;
}
