import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ErrorState, ErrorType } from '@/types';
import { UI_CONFIG } from '@/constants/config';
import { errorStyles } from '@/styles/common';

interface ErrorHandlerProps {
    readonly error: ErrorState | null;
    onDismiss: () => void;
}

interface ErrorConfig {
    readonly icon: string;
    readonly color: string;
}

const ERROR_CONFIGS: Record<ErrorType, ErrorConfig> = {
    image: { icon: '📷', color: UI_CONFIG.colors.warning },
    navigation: { icon: '🧭', color: UI_CONFIG.colors.primary },
    map: { icon: '🗺️', color: UI_CONFIG.colors.success },
    general: { icon: '⚠️', color: UI_CONFIG.colors.error },
    permission: { icon: '🔒', color: UI_CONFIG.colors.error },
} as const;

const ErrorHandler = memo<ErrorHandlerProps>(({ error, onDismiss }) => {
    const config = useMemo(() => {
        if (!error) return null;
        return ERROR_CONFIGS[error.type] || ERROR_CONFIGS.general;
    }, [error]);

    if (!error || !config) return null;

    return (
        <View style={[errorStyles.container, { borderLeftColor: config.color }]}>
            <View style={errorStyles.content}>
                <Text style={errorStyles.icon}>{config.icon}</Text>
                <Text style={errorStyles.message}>{error.message}</Text>
            </View>
            <TouchableOpacity 
                style={errorStyles.closeButton} 
                onPress={onDismiss}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Text style={errorStyles.closeText}>×</Text>
            </TouchableOpacity>
        </View>
    );
});

ErrorHandler.displayName = 'ErrorHandler';

export default ErrorHandler;