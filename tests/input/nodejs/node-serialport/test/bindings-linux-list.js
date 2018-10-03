'use strict';

var _templateObject = _taggedTemplateLiteral(['\nP: /devices/platform/serial8250/tty/ttyS0\nN: ttyS0\nE: DEVNAME=/dev/ttyS0\nE: DEVPATH=/devices/platform/serial8250/tty/ttyS0\nE: MAJOR=4\nE: MINOR=64\nE: SUBSYSTEM=tty\n\nP: /devices/platform/serial8250/tty/ttyS1\nN: ttyS1\nE: DEVNAME=/dev/ttyS1\nE: DEVPATH=/devices/platform/serial8250/tty/ttyS1\nE: MAJOR=4\nE: MINOR=65\nE: SUBSYSTEM=tty\n\nP: /devices/pci0000:00/0000:00:06.0/usb1/1-2/1-2:1.0/tty/ttyACM0\nN: ttyACM0\nS: serial/by-id/usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00\nS: serial/by-path/pci-0000:00:06.0-usb-0:2:1.0\nE: DEVLINKS=/dev/serial/by-path/pci-0000:00:06.0-usb-0:2:1.0 /dev/serial/by-id/usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00\nE: DEVNAME=/dev/ttyACM0\nE: DEVPATH=/devices/pci0000:00/0000:00:06.0/usb1/1-2/1-2:1.0/tty/ttyACM0\nE: ID_BUS=usb\nE: ID_MM_CANDIDATE=1\nE: ID_MODEL=0043\nE: ID_MODEL_ENC=0043\nE: ID_MODEL_FROM_DATABASE=Uno R3 (CDC ACM)\nE: ID_MODEL_ID=0043\nE: ID_PATH=pci-0000:00:06.0-usb-0:2:1.0\nE: ID_PATH_TAG=pci-0000_00_06_0-usb-0_2_1_0\nE: ID_PCI_CLASS_FROM_DATABASE=Serial bus controller\nE: ID_PCI_INTERFACE_FROM_DATABASE=OHCI\nE: ID_PCI_SUBCLASS_FROM_DATABASE=USB controller\nE: ID_REVISION=0001\nE: ID_SERIAL=Arduino__www.arduino.cc__0043_752303138333518011C1\nE: ID_SERIAL_SHORT=752303138333518011C1\nE: ID_TYPE=generic\nE: ID_USB_CLASS_FROM_DATABASE=Communications\nE: ID_USB_DRIVER=cdc_acm\nE: ID_USB_INTERFACES=:020201:0a0000:\nE: ID_USB_INTERFACE_NUM=00\nE: ID_VENDOR=Arduino__www.arduino.cc_\nE: ID_VENDOR_ENC=Arduino (www.arduino.cc)\nE: ID_VENDOR_FROM_DATABASE=Arduino SA\nE: ID_VENDOR_ID=2341\nE: MAJOR=166\nE: MINOR=0\nE: SUBSYSTEM=tty\nE: TAGS=:systemd:\nE: USEC_INITIALIZED=2219936602\n\nP: /devices/unknown\nN: ttyAMA_im_a_programmer\nE: DEVNAME=/dev/ttyAMA_im_a_programmer\nE: DEVLINKS=/dev/serial/by-id/pci-NATA_Siolynx2_C8T6VI1F-if00-port0 /dev/serial/by-path/pci-0000:00:14.0-usb-0:2:1.0-port0\n\nP: /devices/unknown\nN: ttyMFD0\nE: DEVNAME=/dev/ttyMFD0\nE: ID_VENDOR_ID=0x2343\nE: ID_MODEL_ID=0043\nE: ID_MODEL_ENC=some device made by someone\n\nP: /devices/unknown\nN: rfcomm4\nE: DEVNAME=/dev/rfcomm4\n\nP: /devices/unknown\nN: ttyNOTASERIALPORT\n'], ['\nP: /devices/platform/serial8250/tty/ttyS0\nN: ttyS0\nE: DEVNAME=/dev/ttyS0\nE: DEVPATH=/devices/platform/serial8250/tty/ttyS0\nE: MAJOR=4\nE: MINOR=64\nE: SUBSYSTEM=tty\n\nP: /devices/platform/serial8250/tty/ttyS1\nN: ttyS1\nE: DEVNAME=/dev/ttyS1\nE: DEVPATH=/devices/platform/serial8250/tty/ttyS1\nE: MAJOR=4\nE: MINOR=65\nE: SUBSYSTEM=tty\n\nP: /devices/pci0000:00/0000:00:06.0/usb1/1-2/1-2:1.0/tty/ttyACM0\nN: ttyACM0\nS: serial/by-id/usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00\nS: serial/by-path/pci-0000:00:06.0-usb-0:2:1.0\nE: DEVLINKS=/dev/serial/by-path/pci-0000:00:06.0-usb-0:2:1.0 /dev/serial/by-id/usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00\nE: DEVNAME=/dev/ttyACM0\nE: DEVPATH=/devices/pci0000:00/0000:00:06.0/usb1/1-2/1-2:1.0/tty/ttyACM0\nE: ID_BUS=usb\nE: ID_MM_CANDIDATE=1\nE: ID_MODEL=0043\nE: ID_MODEL_ENC=0043\nE: ID_MODEL_FROM_DATABASE=Uno R3 (CDC ACM)\nE: ID_MODEL_ID=0043\nE: ID_PATH=pci-0000:00:06.0-usb-0:2:1.0\nE: ID_PATH_TAG=pci-0000_00_06_0-usb-0_2_1_0\nE: ID_PCI_CLASS_FROM_DATABASE=Serial bus controller\nE: ID_PCI_INTERFACE_FROM_DATABASE=OHCI\nE: ID_PCI_SUBCLASS_FROM_DATABASE=USB controller\nE: ID_REVISION=0001\nE: ID_SERIAL=Arduino__www.arduino.cc__0043_752303138333518011C1\nE: ID_SERIAL_SHORT=752303138333518011C1\nE: ID_TYPE=generic\nE: ID_USB_CLASS_FROM_DATABASE=Communications\nE: ID_USB_DRIVER=cdc_acm\nE: ID_USB_INTERFACES=:020201:0a0000:\nE: ID_USB_INTERFACE_NUM=00\nE: ID_VENDOR=Arduino__www.arduino.cc_\nE: ID_VENDOR_ENC=Arduino\\x20\\x28www.arduino.cc\\x29\nE: ID_VENDOR_FROM_DATABASE=Arduino SA\nE: ID_VENDOR_ID=2341\nE: MAJOR=166\nE: MINOR=0\nE: SUBSYSTEM=tty\nE: TAGS=:systemd:\nE: USEC_INITIALIZED=2219936602\n\nP: /devices/unknown\nN: ttyAMA_im_a_programmer\nE: DEVNAME=/dev/ttyAMA_im_a_programmer\nE: DEVLINKS=/dev/serial/by-id/pci-NATA_Siolynx2_C8T6VI1F-if00-port0 /dev/serial/by-path/pci-0000:00:14.0-usb-0:2:1.0-port0\n\nP: /devices/unknown\nN: ttyMFD0\nE: DEVNAME=/dev/ttyMFD0\nE: ID_VENDOR_ID=0x2343\nE: ID_MODEL_ID=0043\nE: ID_MODEL_ENC=some device made by someone\n\nP: /devices/unknown\nN: rfcomm4\nE: DEVNAME=/dev/rfcomm4\n\nP: /devices/unknown\nN: ttyNOTASERIALPORT\n']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var listLinux = require('./mocks/linux-list');

var ports = String.raw(_templateObject);

var portOutput = [{
  comName: '/dev/ttyS0'
}, {
  comName: '/dev/ttyS1'
}, {
  comName: '/dev/ttyACM0',
  manufacturer: 'Arduino (www.arduino.cc)',
  serialNumber: '752303138333518011C1',
  productId: '0043',
  vendorId: '2341',
  pnpId: 'usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00'
}, {
  comName: '/dev/ttyAMA_im_a_programmer',
  pnpId: 'pci-NATA_Siolynx2_C8T6VI1F-if00-port0'
}, {
  comName: '/dev/ttyMFD0',
  vendorId: '2343',
  productId: '0043'
}, {
  comName: '/dev/rfcomm4'
}];

describe('test96- listLinux', function () {
  beforeEach(function () {
    listLinux.reset();
  });

  it('lists available serialports', function () {
    listLinux.setPorts(ports);
    return listLinux().then(function (ports) {
      assert.containSubset(ports, portOutput);
    });
  });
});