/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from '@testing-library/dom';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    // DEBUT TEST_1_INVALID_FILE_EXTENSION
    test('Then uploading a file with invalid extension should show an alert', () => {
      // GIVEN
      // 1. Créer HTML du formulaire
      document.body.innerHTML = NewBillUI();

      // 2. Mocker alerte
      window.alert = jest.fn();

      // 3. Créer instance de NewBill
      const newBillInstance = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: window.localStorage,
      });

      // WHEN
      // 1. Récupérer input file
      const fileInput = screen.getByTestId('file');

      // 2. Créer faux .pdf
      const file = new File(['contenu'], 'facture.pdf', {
        type: 'application/pdf',
      });

      // 3. Simuler sélection du fichier
      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      // 4. Créer événement change
      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\facture.pdf',
        },
      };

      // 5. Appeler handleChangeFile
      newBillInstance.handleChangeFile(event);

      // THEN
      // 1. Vérifier que l'alerte a été affichée
      expect(window.alert).toHaveBeenCalled();

      // 2. Vérifier que le champ file a été réinitialisé
      expect(event.target.value).toBe('');
    });
    // FIN TEST_1_INVALID_FILE_EXTENSION

    //---------------------------------------------------------------------------------------//

    // DEBUT TEST_2A_JPG_FILE_EXTENSION
    test('Then uploading a file with jpg extension should be accepted', async () => {
      // GIVEN
      document.body.innerHTML = NewBillUI();

      window.localStorage.setItem(
        'user',
        JSON.stringify({
          email: 'employee@test.com',
        })
      );

      window.alert = jest.fn();

      // Mock du store
      const mockCreate = jest.fn().mockResolvedValue({
        fileUrl: 'https://localhost:3456/images/test.jpg',
        key: '1234',
      });

      const mockBills = {
        create: mockCreate,
      };

      const store = {
        bills: jest.fn(() => mockBills),
      };

      const newBillInstance = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      });

      // WHEN
      const fileInput = screen.getByTestId('file');

      const file = new File(['contenu'], 'facture.jpg', {
        type: 'image/jpg',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\facture.jpg',
        },
      };

      newBillInstance.handleChangeFile(event);

      // Attendre promise résolue
      await new Promise(process.nextTick);

      // THEN
      expect(window.alert).not.toHaveBeenCalled();
      expect(event.target.value).not.toBe('');
      expect(mockCreate).toHaveBeenCalled();
    });
    // FIN TEST_2A_JPG_FILE_EXTENSION
    //---------------------------------------------------------------------------------------//
    // DEBUT TEST_2_B_JPEG_FILE_EXTENSION
    test('Then uploading a file with jpeg extension should be accepted', async () => {
      // GIVEN
      document.body.innerHTML = NewBillUI();

      window.localStorage.setItem(
        'user',
        JSON.stringify({
          email: 'employee@test.com',
        })
      );

      window.alert = jest.fn();

      // Mock du store
      const mockCreate = jest.fn().mockResolvedValue({
        fileUrl: 'https://localhost:3456/images/test.jpeg',
        key: '1234',
      });

      const mockBills = {
        create: mockCreate,
      };

      const store = {
        bills: jest.fn(() => mockBills),
      };

      const newBillInstance = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      });

      // WHEN
      const fileInput = screen.getByTestId('file');

      const file = new File(['contenu'], 'facture.jpeg', {
        type: 'image/jpeg',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\facture.jpeg',
        },
      };

      newBillInstance.handleChangeFile(event);

      // Attendre promise résolue
      await new Promise(process.nextTick);

      // THEN
      expect(window.alert).not.toHaveBeenCalled();
      expect(event.target.value).not.toBe('');
      expect(mockCreate).toHaveBeenCalled();
    });
    // FIN TEST_2_B_JPEG_FILE_EXTENSION
    //---------------------------------------------------------------------------------------//
    // DEBUT TEST_2C_PNG_FILE_EXTENSION
    test('Then uploading a file with png extension should be accepted', async () => {
      // GIVEN
      document.body.innerHTML = NewBillUI();

      window.localStorage.setItem(
        'user',
        JSON.stringify({
          email: 'employee@test.com',
        })
      );

      window.alert = jest.fn();

      // Mock du store
      const mockCreate = jest.fn().mockResolvedValue({
        fileUrl: 'https://localhost:3456/images/test.png',
        key: '1234',
      });

      const mockBills = {
        create: mockCreate,
      };

      const store = {
        bills: jest.fn(() => mockBills),
      };

      const newBillInstance = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      });

      // WHEN
      const fileInput = screen.getByTestId('file');

      const file = new File(['contenu'], 'facture.png', {
        type: 'image/png',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\facture.png',
        },
      };

      newBillInstance.handleChangeFile(event);

      // Attendre promise résolue
      await new Promise(process.nextTick);

      // THEN
      expect(window.alert).not.toHaveBeenCalled();
      expect(event.target.value).not.toBe('');
      expect(mockCreate).toHaveBeenCalled();
    });
    // FIN TEST_2C_PNG_FILE_EXTENSION
  });
});
