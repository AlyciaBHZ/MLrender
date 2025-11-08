import { describe, it, expect } from 'vitest';
import {
  MLComponentSchemas,
  getDefaultMLParams,
  validateParameter,
  getSchemaField,
} from '../componentSchemas';

describe('MLComponentSchemas', () => {
  describe('Schema definitions', () => {
    it('should have FC_LAYER schema with required fields', () => {
      expect(MLComponentSchemas.FC_LAYER).toBeDefined();
      expect(MLComponentSchemas.FC_LAYER.inputDim).toBeDefined();
      expect(MLComponentSchemas.FC_LAYER.outputDim).toBeDefined();
      expect(MLComponentSchemas.FC_LAYER.activation).toBeDefined();
      expect(MLComponentSchemas.FC_LAYER.useBias).toBeDefined();
    });

    it('should have ATTENTION schema with required fields', () => {
      expect(MLComponentSchemas.ATTENTION).toBeDefined();
      expect(MLComponentSchemas.ATTENTION.numHeads).toBeDefined();
      expect(MLComponentSchemas.ATTENTION.embedDim).toBeDefined();
      expect(MLComponentSchemas.ATTENTION.dropout).toBeDefined();
    });

    it('should have RNN_LSTM schema with required fields', () => {
      expect(MLComponentSchemas.RNN_LSTM).toBeDefined();
      expect(MLComponentSchemas.RNN_LSTM.cellType).toBeDefined();
      expect(MLComponentSchemas.RNN_LSTM.hiddenSize).toBeDefined();
      expect(MLComponentSchemas.RNN_LSTM.numLayers).toBeDefined();
      expect(MLComponentSchemas.RNN_LSTM.bidirectional).toBeDefined();
    });

    it('should have CONV_LAYER schema with 7 parameters', () => {
      expect(MLComponentSchemas.CONV_LAYER).toBeDefined();
      const paramCount = Object.keys(MLComponentSchemas.CONV_LAYER).length;
      expect(paramCount).toBe(7);
    });
  });

  describe('getDefaultMLParams', () => {
    it('should return default params for FC_LAYER', () => {
      const params = getDefaultMLParams('FC_LAYER');
      expect(params).toEqual({
        inputDim: 512,
        outputDim: 128,
        activation: 'ReLU',
        useBias: true,
      });
    });

    it('should return default params for ATTENTION', () => {
      const params = getDefaultMLParams('ATTENTION');
      expect(params).toEqual({
        numHeads: 8,
        embedDim: 512,
        dropout: 0.1,
      });
    });

    it('should return default params for RNN_LSTM', () => {
      const params = getDefaultMLParams('RNN_LSTM');
      expect(params).toEqual({
        cellType: 'LSTM',
        hiddenSize: 256,
        numLayers: 2,
        bidirectional: false,
        dropout: 0.2,
      });
    });

    it('should return default params for DROPOUT', () => {
      const params = getDefaultMLParams('DROPOUT');
      expect(params).toEqual({
        dropoutRate: 0.5,
        visualizeDropped: true,
        seed: '',
      });
    });

    it('should return DEFAULT schema for unknown type', () => {
      const params = getDefaultMLParams('UNKNOWN_TYPE');
      // Falls back to DEFAULT schema which has 'notes' field
      expect(params).toHaveProperty('notes');
      expect(params.notes).toBe('');
    });

    it('should return DEFAULT schema for empty string', () => {
      const params = getDefaultMLParams('');
      // Falls back to DEFAULT schema which has 'notes' field
      expect(params).toHaveProperty('notes');
      expect(params.notes).toBe('');
    });
  });

  describe('validateParameter', () => {
    describe('number validation', () => {
      it('should clamp number to min value', () => {
        const result = validateParameter('FC_LAYER', 'inputDim', 0);
        expect(result).toBe(1); // min is 1
      });

      it('should clamp number to max value', () => {
        const result = validateParameter('DROPOUT', 'dropoutRate', 1.5);
        expect(result).toBe(0.95); // max is 0.95
      });

      it('should accept valid number within range', () => {
        const result = validateParameter('FC_LAYER', 'inputDim', 256);
        expect(result).toBe(256);
      });

      it('should handle negative numbers correctly', () => {
        const result = validateParameter('ATTENTION', 'numHeads', -5);
        expect(result).toBe(1); // min is 1
      });
    });

    describe('select validation', () => {
      it('should accept valid option', () => {
        const result = validateParameter('RNN_LSTM', 'cellType', 'LSTM');
        expect(result).toBe('LSTM');
      });

      it('should reject invalid option and return default', () => {
        const result = validateParameter('RNN_LSTM', 'cellType', 'INVALID');
        expect(result).toBe('LSTM'); // default
      });

      it('should validate conv kernel size options', () => {
        const validResult = validateParameter('CONV_LAYER', 'kernelSize', 3);
        expect(validResult).toBe(3);

        const invalidResult = validateParameter('CONV_LAYER', 'kernelSize', 4);
        expect(invalidResult).toBe(3); // default
      });

      it('should validate activation options', () => {
        const validResult = validateParameter('FC_LAYER', 'activation', 'ReLU');
        expect(validResult).toBe('ReLU');

        const invalidResult = validateParameter('FC_LAYER', 'activation', 'InvalidFunc');
        expect(invalidResult).toBe('ReLU'); // default
      });
    });

    describe('boolean validation', () => {
      it('should return true for truthy values', () => {
        expect(validateParameter('FC_LAYER', 'useBias', true)).toBe(true);
        expect(validateParameter('FC_LAYER', 'useBias', 1)).toBe(true);
        expect(validateParameter('FC_LAYER', 'useBias', 'true')).toBe(true);
      });

      it('should return false for falsy values', () => {
        expect(validateParameter('FC_LAYER', 'useBias', false)).toBe(false);
        expect(validateParameter('FC_LAYER', 'useBias', 0)).toBe(false);
        expect(validateParameter('FC_LAYER', 'useBias', '')).toBe(false);
      });
    });

    describe('range validation', () => {
      it('should clamp range value to min', () => {
        const result = validateParameter('DROPOUT', 'dropoutRate', -0.5);
        expect(result).toBe(0.0);
      });

      it('should clamp range value to max', () => {
        const result = validateParameter('ATTENTION', 'dropout', 1.0);
        expect(result).toBe(0.5); // max is 0.5
      });

      it('should accept valid range value', () => {
        const result = validateParameter('DROPOUT', 'dropoutRate', 0.3);
        expect(result).toBe(0.3);
      });
    });

    describe('string validation', () => {
      it('should return string value as-is', () => {
        const result = validateParameter('DROPOUT', 'seed', 'test-seed-123');
        expect(result).toBe('test-seed-123');
      });

      it('should handle empty string', () => {
        const result = validateParameter('DROPOUT', 'seed', '');
        expect(result).toBe('');
      });
    });

    describe('edge cases', () => {
      it('should return value if component type not found', () => {
        const result = validateParameter('UNKNOWN', 'param', 'value');
        expect(result).toBe('value');
      });

      it('should return value if parameter not found', () => {
        const result = validateParameter('FC_LAYER', 'unknownParam', 'value');
        expect(result).toBe('value');
      });

      it('should handle null values', () => {
        // null is coerced to 0, which is then clamped to min(1)
        const result = validateParameter('FC_LAYER', 'inputDim', null);
        expect(result).toBe(1); // clamped to min
      });

      it('should handle undefined values', () => {
        const result = validateParameter('FC_LAYER', 'inputDim', undefined);
        expect(result).toBe(512); // default
      });
    });
  });

  describe('getSchemaField', () => {
    it('should return schema field for valid component and param', () => {
      const field = getSchemaField('FC_LAYER', 'inputDim');
      expect(field).toBeDefined();
      expect(field?.type).toBe('number');
      expect(field?.default).toBe(512);
      expect(field?.min).toBe(1);
    });

    it('should return schema field with options for select type', () => {
      const field = getSchemaField('RNN_LSTM', 'cellType');
      expect(field).toBeDefined();
      expect(field?.type).toBe('select');
      expect(field?.options).toEqual(['RNN', 'LSTM', 'GRU']);
    });

    it('should return undefined for unknown component', () => {
      const field = getSchemaField('UNKNOWN', 'param');
      expect(field).toBeUndefined();
    });

    it('should return undefined for unknown parameter', () => {
      const field = getSchemaField('FC_LAYER', 'unknownParam');
      expect(field).toBeUndefined();
    });

    it('should return field with hint and i18nKey', () => {
      const field = getSchemaField('ATTENTION', 'numHeads');
      expect(field).toBeDefined();
      expect(field?.hint).toBe('Multi-head attention heads');
      expect(field?.i18nKey).toBe('schema.attn.heads');
    });
  });

  describe('Schema completeness', () => {
    it('should have schemas for all major component types', () => {
      const expectedTypes = [
        'FC_LAYER',
        'MLP_LAYERS',
        'CONV_LAYER',
        'POOLING',
        'FLATTEN',
        'ACTIVATION',
        'DROPOUT',
        'DATA',
        'TENSOR',
        'BATCH_NORM',
        'LAYER_NORM',
        'ATTENTION',
        'RNN_LSTM',
      ];

      expectedTypes.forEach(type => {
        expect(MLComponentSchemas[type]).toBeDefined();
        expect(Object.keys(MLComponentSchemas[type]).length).toBeGreaterThan(0);
      });
    });

    it('should have consistent field structure for all schemas', () => {
      Object.entries(MLComponentSchemas).forEach(([componentType, schema]) => {
        Object.entries(schema).forEach(([paramName, field]) => {
          // Every field must have these required properties
          expect(field.type).toBeDefined();
          expect(field.label).toBeDefined();
          expect(field.i18nKey).toBeDefined();
          expect(field.default).toBeDefined();

          // Type-specific validation
          if (field.type === 'number' || field.type === 'range') {
            // Numbers and ranges should have min
            expect(field.min).toBeDefined();
          }

          if (field.type === 'select') {
            // Selects must have options
            expect(field.options).toBeDefined();
            expect(Array.isArray(field.options)).toBe(true);
            expect(field.options.length).toBeGreaterThan(0);
          }
        });
      });
    });
  });
});

