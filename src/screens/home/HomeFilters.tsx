import { StyleSheet, View } from 'react-native';
import { OptionGroup } from '@/components/OptionGroup';
import {
  budgetOptions,
  companyOptions,
  energyOptions,
  locationOptions,
  timeOptions,
  transportationOptions,
} from '@/data/filterOptions';
import { RandomizerContext } from '@/types/domain';

interface HomeFiltersProps {
  filters: RandomizerContext;
  onChange: <K extends keyof RandomizerContext>(
    key: K,
    value: RandomizerContext[K],
  ) => void;
}

export function HomeFilters({ filters, onChange }: HomeFiltersProps) {
  return (
    <View style={styles.container}>
      <OptionGroup
        label="TEMPO DISPONÍVEL"
        options={timeOptions}
        value={filters.availableMinutes}
        onChange={(value) => onChange('availableMinutes', value)}
      />

      <OptionGroup
        label="ORÇAMENTO"
        options={budgetOptions}
        value={filters.budgetLimit}
        onChange={(value) => onChange('budgetLimit', value)}
      />

      <OptionGroup
        label="LOCAL"
        options={locationOptions}
        value={filters.location}
        onChange={(value) => onChange('location', value)}
      />

      <OptionGroup
        label="ENERGIA"
        options={energyOptions}
        value={filters.energy}
        onChange={(value) => onChange('energy', value)}
      />

      <OptionGroup
        label="COMPANHIA"
        options={companyOptions}
        value={filters.company}
        onChange={(value) => onChange('company', value)}
      />

      {filters.location !== 'home' && (
        <OptionGroup
          label="MEIOS DISPONÍVEIS"
          options={transportationOptions}
          value={filters.transportation}
          onChange={(value) => onChange('transportation', value)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 25,
  },
});
