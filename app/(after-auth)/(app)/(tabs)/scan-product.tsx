import {Alert, Button, StyleSheet, Text, View} from "react-native";
import {useCallback, useRef, useState} from "react";
import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {BarcodeScanningResult} from "expo-camera/src/Camera.types";
import {api} from "@/lib/api";
import {useFocusEffect, useRouter} from "expo-router";
import {useApiMutation} from "@/hooks/useApiMutation";
import {CreateProductDto} from "@/generated-api";
import {AxiosError} from "axios";
import {useTranslation} from "react-i18next";

const ScanProduct = () => {
  const { t, ready } = useTranslation(['common', 'error']);
  const [facing, _] = useState<CameraType>('back');
  const camera = useRef<CameraView>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const isProcessing = useRef(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      isProcessing.current = false;
      void camera.current?.resumePreview();
      setIsActive(true);

      return () => {
        setIsActive(false);
        void camera.current?.pausePreview();
        isProcessing.current = true;
      };
    }, [])
  );

  const getProductByBarcodeV1 = useApiMutation((data: string) => api.product.getProductByBarcodeV1(data));
  const createProductV1 = useApiMutation((data: CreateProductDto) => api.product.createProductV1(data));

  const handleBarcodeScanned = useCallback(async ({ data: barcode }: BarcodeScanningResult) => {
    try {
      if (isProcessing.current) return;
      isProcessing.current = true;

      const product = await getProductByBarcodeV1.mutateAsync(barcode);
      router.push(`/(after-auth)/(app)/add-item/${product.data.id}`);
    } catch (_) {
      try {
        const product = await createProductV1.mutateAsync({
          barcode,
        });
        router.push(`/(after-auth)/(app)/add-item/${product.data.id}`);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data?.message) {
            Alert.alert('Error', error.response.data.message, [{
              style: 'default',
              onPress: () => {
                isProcessing.current = false;
              }
            }]);
            return;
        }
        Alert.alert('Error', t('generic', { ns: 'error' }), [{
          style: 'default',
          onPress: () => {
            isProcessing.current = false;
          }
        }]);
      }
    }
  }, []);

  if (!permission || !ready) {
    return <View />;
  }

  if (!permission.granted) {
    return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <CameraView
            ref={camera}
            active={isActive}
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: [
                'ean13',
                'ean8',
              ],
            }}
            onBarcodeScanned={handleBarcodeScanned}
            autofocus={'on'}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ScanProduct;