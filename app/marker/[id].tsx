import React, {useCallback} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import ImageList from '@/components/ImageList';
import ErrorHandler from '@/components/ErrorHandler';
import {useMarkersStore, useImagesStore} from '@/store';
import {ERROR_MESSAGES, UI_TEXTS} from '@/constants/config';
import {formatCoordinate, formatDate} from '@/utils/helpers';
import {commonStyles, buttonStyles} from '@/styles/common';

export default function MarkerDetailsScreen() {
    const {id} = useLocalSearchParams<{ id: string }>();
    
    const marker = useMarkersStore((state) =>
        id ? state.markers.find((m) => m.id === id) : undefined
    );
    const removeMarker = useMarkersStore((state) => state.removeMarker);
    const isMarkersLoading = useMarkersStore((state) => state.isLoading);
    const markersError = useMarkersStore((state) => state.error);
    const clearMarkersError = useMarkersStore((state) => state.clearError);
    
    const imagesError = useImagesStore((state) => state.error);
    const clearImagesError = useImagesStore((state) => state.clearError);
    
    const error = markersError || imagesError;
    const clearError = useCallback(() => {
        clearMarkersError();
        clearImagesError();
    }, [clearMarkersError, clearImagesError]);

    const handleDeleteMarker = useCallback(async () => {
        if (!id) return;

        Alert.alert(
            UI_TEXTS.TITLES.CONFIRM_DELETE_MARKER,
            UI_TEXTS.CONFIRMATIONS.DELETE_MARKER,
            [
                {
                    text: UI_TEXTS.BUTTONS.CANCEL,
                    style: 'cancel',
                },
                {
                    text: UI_TEXTS.BUTTONS.DELETE,
                    style: 'destructive',
                    onPress: async () => {
                        const success = await removeMarker(id);
                        if (success) {
                            router.back();
                        }
                    },
                },
            ]
        );
    }, [id, removeMarker]);

    if (!marker) {
        return (
            <SafeAreaView style={commonStyles.container}>
                <View style={commonStyles.centerContent}>
                    <Text style={commonStyles.title}>
                        {ERROR_MESSAGES.MARKER_NOT_FOUND}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={commonStyles.container}>
            <ScrollView
                style={commonStyles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
            >
                <View style={[commonStyles.surface, commonStyles.padding, commonStyles.marginBottom]}>
                    <Text style={commonStyles.caption}>
                        Координаты: {formatCoordinate(marker.coordinate.latitude)}, {formatCoordinate(marker.coordinate.longitude)}
                    </Text>
                    <Text style={commonStyles.caption}>
                        Создан: {formatDate(marker.createdAt)}
                    </Text>
                    {marker.updatedAt && (
                        <Text style={commonStyles.caption}>
                            Обновлен: {formatDate(marker.updatedAt)}
                        </Text>
                    )}
                    
                    <TouchableOpacity
                        style={[buttonStyles.danger, {marginTop: 16}]}
                        onPress={handleDeleteMarker}
                        disabled={isMarkersLoading}
                    >
                        <Text style={buttonStyles.dangerText}>
                            {UI_TEXTS.BUTTONS.DELETE_MARKER}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ErrorHandler error={error} onDismiss={clearError}/>

                <View style={[commonStyles.marginBottom, {marginHorizontal: 16}]}>
                    <ImageList markerId={id as string} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

