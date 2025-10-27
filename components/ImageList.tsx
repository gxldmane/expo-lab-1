import React, {memo, useCallback, useMemo} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import {MarkerImage} from '@/types';
import {UI_CONFIG, UI_TEXTS, SCREEN_CONFIG} from '@/constants/config';
import {commonStyles, buttonStyles} from '@/styles/common';
import {useMarkersStore, useImagesStore} from '@/store';

interface ImageListProps {
    readonly markerId: string;
}

interface ImageItemProps {
    readonly image: MarkerImage;
    onDelete: (imageId: string, imageName: string) => void;
}

const {width} = Dimensions.get('window');
const imageSize = Math.max(
    Math.min(width / SCREEN_CONFIG.IMAGE_SIZE_RATIO, SCREEN_CONFIG.MAX_IMAGE_SIZE),
    SCREEN_CONFIG.MIN_IMAGE_SIZE
);

const ImageItem = memo<ImageItemProps>(({image, onDelete}) => {
    const handleDelete = useCallback(() => {
        onDelete(image.id, image.name);
    }, [image.id, image.name, onDelete]);

    return (
        <TouchableOpacity
            style={styles.imageContainer}
            onLongPress={handleDelete}
            activeOpacity={0.8}
        >
            <Image
                source={{uri: image.uri}}
                style={styles.image}
                resizeMode="cover"
            />
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
                <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
});

ImageItem.displayName = 'ImageItem';

const ImageList = memo<ImageListProps>(({ markerId }) => {
    const marker = useMarkersStore((state) =>
        state.markers.find((m) => m.id === markerId)
    );
    const saveImageToMarker = useMarkersStore((state) => state.saveImageToMarker);
    const deleteImageFromMarker = useMarkersStore((state) => state.deleteImageFromMarker);
    const isMarkersLoading = useMarkersStore((state) => state.isLoading);
    
    const pickImageForMarker = useImagesStore((state) => state.pickImageForMarker);
    const isImagesLoading = useImagesStore((state) => state.isLoading);

    const images = useMemo(() => marker?.images || [], [marker?.images]);
    const isLoading = isMarkersLoading || isImagesLoading;

    const handleAddImage = useCallback(async () => {
        const imageData = await pickImageForMarker();
        if (imageData) {
            await saveImageToMarker(markerId, imageData);
        }
    }, [markerId, pickImageForMarker, saveImageToMarker]);

    const handleDeleteImage = useCallback((imageId: string, imageName: string) => {
        Alert.alert(
            UI_TEXTS.TITLES.CONFIRM_DELETE,
            `Вы уверены, что хотите удалить "${imageName}"?`,
            [
                {text: UI_TEXTS.BUTTONS.CANCEL, style: 'cancel'},
                {
                    text: UI_TEXTS.BUTTONS.DELETE,
                    style: 'destructive',
                    onPress: () => deleteImageFromMarker(markerId, imageId),
                },
            ]
        );
    }, [markerId, deleteImageFromMarker]);

    const renderedImages = useMemo(() => {
        return images.map((image) => (
            <ImageItem
                key={image.id}
                image={image}
                onDelete={handleDeleteImage}
            />
        ));
    }, [images, handleDeleteImage]);

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={[commonStyles.title, styles.title]}>
                {UI_TEXTS.TITLES.IMAGES} ({images.length})
            </Text>
            <TouchableOpacity
                style={[buttonStyles.success, styles.addButton]}
                onPress={handleAddImage}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color={UI_CONFIG.colors.surface}/>
                ) : (
                    <Text style={buttonStyles.successText}>
                        {UI_TEXTS.BUTTONS.ADD_PHOTO}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderEmptyState = () => (
        <View style={[commonStyles.centerContent, styles.emptyState]}>
            <Text style={styles.emptyStateEmoji}>📷</Text>
            <Text style={[commonStyles.subtitle, styles.emptyStateText]}>
                {UI_TEXTS.PLACEHOLDERS.NO_IMAGES}
            </Text>
            <Text style={[commonStyles.body, styles.emptyStateSubtext]}>
                {UI_TEXTS.PLACEHOLDERS.NO_IMAGES_SUBTITLE}
            </Text>
        </View>
    );

    return (
        <View style={[commonStyles.surface, styles.container]}>
            {renderHeader()}
            {images.length === 0 ? (
                renderEmptyState()
            ) : (
                <View style={[styles.contentContainer, styles.imagesGrid]}>
                    {renderedImages}
                </View>
            )}
        </View>
    );
});

ImageList.displayName = 'ImageList';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: UI_CONFIG.colors.surface,
        borderRadius: UI_CONFIG.borderRadius.md,
    },
    contentContainer: {
        padding: UI_CONFIG.spacing.md,
    },
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    header: {
        marginBottom: UI_CONFIG.spacing.md,
    },
    title: {
        marginLeft: UI_CONFIG.spacing.sm + 4,
        paddingVertical: UI_CONFIG.spacing.sm + 4,
    },
    addButton: {
        width: '80%',
        alignSelf: 'center',
    },
    imageContainer: {
        width: imageSize,
        margin: UI_CONFIG.spacing.xs,
        position: 'relative',
    },
    image: {
        width: imageSize,
        height: imageSize,
        borderRadius: UI_CONFIG.borderRadius.sm,
        backgroundColor: UI_CONFIG.colors.background,
    },
    deleteButton: {
        position: 'absolute',
        top: UI_CONFIG.spacing.xs,
        right: UI_CONFIG.spacing.xs,
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: UI_CONFIG.colors.surface,
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 16,
    },
    emptyState: {
        paddingVertical: UI_CONFIG.spacing.xl + 8,
    },
    emptyStateEmoji: {
        fontSize: 48,
        marginBottom: UI_CONFIG.spacing.md,
    },
    emptyStateText: {
        marginBottom: UI_CONFIG.spacing.sm,
    },
    emptyStateSubtext: {
        textAlign: 'center',
    },
});

export default ImageList;

