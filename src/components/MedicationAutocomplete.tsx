import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppSettings } from '../context/AppSettingsContext';
import { MedicationSuggestion, MedicineForm } from '../types/medication';
import { sanitizeMedicineName } from '../utils/inputSanitizers';

type Props = {
  form: MedicineForm;
  setForm: React.Dispatch<React.SetStateAction<MedicineForm>>;
  placeholder: string;
  placeholderTextColor: string;
  maxLength: number;
  medicationCatalog: MedicationSuggestion[];
};

export function MedicationAutocomplete({
  form,
  setForm,
  placeholder,
  placeholderTextColor,
  maxLength,
  medicationCatalog,
}: Props) {
  const { styles: appStyles } = useAppSettings();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = useMemo(() => {
    const query = form.name.toLowerCase().trim();
    if (!query) {
      return [];
    }
    const results = medicationCatalog.filter(med =>
      med.name.toLowerCase().startsWith(query),
    );
    return results.slice(0, 8);
  }, [form.name, medicationCatalog]);

  const selectMedication = (med: MedicationSuggestion) => {
    setShowSuggestions(false);
    setForm(current => ({
      ...current,
      name: med.name,
      dosage: med.dosage,
      medicineType: med.medicineType,
      unit: med.unit,
      frequency: med.frequency,
      foodInstruction: med.foodInstruction,
    }));
  };

  const onChangeText = (value: string) => {
    const sanitized = sanitizeMedicineName(value);
    setForm(current => ({ ...current, name: sanitized }));
    if (sanitized.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const onFocus = () => {
    if (form.name.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <View style={appStyles.nameFieldWrapper}>
      <TextInput
        style={[appStyles.input]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        maxLength={maxLength}
        value={form.name}
        autoCapitalize="words"
        onFocus={onFocus}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200);
        }}
        onChangeText={onChangeText}
      />
      {showSuggestions && filtered.length > 0 && (
        <FlatList
          style={appStyles.autocompleteList}
          data={filtered}
          keyExtractor={item => item.name}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={appStyles.autocompleteItem}
              onPress={() => selectMedication(item)}
            >
              <Text style={appStyles.autocompleteItemText}>{item.name}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={appStyles.autocompleteItemSubtext}>
                  {item.medicineType}
                </Text>
                <Text style={appStyles.autocompleteItemDosage}>
                  {item.dosage} {item.unit}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {showSuggestions && form.name.trim().length > 0 && filtered.length === 0 && (
        <View style={appStyles.autocompleteList}>
          <View style={appStyles.autocompleteEmpty}>
            <Text style={appStyles.autocompleteEmptyText}>
              Sin resultados para &quot;{form.name.trim()}&quot;
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
