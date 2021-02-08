import * as React from 'react';
import {View} from 'react-native';
import {SvgCssUri} from 'react-native-svg';

function SvgImageViewer(props) {
    console.log("")
  const {LocalIcon, path, size, width, style, height} = props;

  const iconProps = {};

  if (size) {
    iconProps.height = size;
    iconProps.width = size;
  }
  if (width) {
    iconProps.width = width;
  }
  if (height) {
    iconProps.height = height;
  }
  return (
    <View style={[{justifyContent: 'center', alignItems: 'center'}, style]}>
      {LocalIcon ? (
        <LocalIcon {...iconProps} />
      ) : (
        <SvgCssUri
          width={width}
          height={height}
          uri={path.includes('.svg') ? path : ''}
        />
      )}
    </View>
  );
}

export default SvgImageViewer;
