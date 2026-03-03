import { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '~/store/useTheme';
import { authStyles } from '~/styles/auth';

export const ThemedTextInput = forwardRef<TextInput, TextInputProps>(
	(props, ref) => {
		const { colors } = useTheme();
		return (
			<TextInput
				ref={ref}
				placeholderTextColor={colors.placeholder}
				{...props}
				style={[
					authStyles.input,
					{ backgroundColor: colors.surface, color: colors.text },
					props.style,
				]}
			/>
		);
	},
);

ThemedTextInput.displayName = 'ThemedTextInput';
