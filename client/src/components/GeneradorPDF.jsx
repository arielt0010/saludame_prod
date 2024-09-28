import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import ConversorNumeros from './ConversorNumeros';
import background2 from '../assets/background2.jpeg';
import logoReducido from '../assets/logoReducido.jpeg';

const DocumentoPDF = async (nro, name, cash, day, month, year, codigo_alumno, curso_alumno, anioseguro) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Tamaño Letter

  const red = rgb(1, 0.1137, 0.05098);
  const blue = rgb(0.043, 0.2549, 0.6118);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const backgroundImageBytes = await fetch(background2).then(res => res.arrayBuffer());
  const backgroundImage = await pdfDoc.embedJpg(backgroundImageBytes);
  const backgroundImageDims = backgroundImage.scale(0.8);

  page.drawImage(backgroundImage, {
    x: 0,
    y: page.getHeight() - backgroundImageDims.height,
    width: backgroundImageDims.width,
    height: backgroundImageDims.height,
    opacity: 0.8,
  });

  const logoImageBytes = await fetch(logoReducido).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedJpg(logoImageBytes); 
  const logoWidth = 200; // Ajusta el tamaño del logo
  const logoHeight = (logoImage.height / logoImage.width) * logoWidth;

  page.drawImage(logoImage, {
    x: 20,
    y: page.getHeight() - logoHeight - 20, // margen superior
    width: logoWidth,
    height: logoHeight,
  });

  const textSize = 22;
  page.drawText('COMPROBANTE', {
    x: page.getWidth() - 200,
    y: page.getHeight() - 50,
    size: textSize,
    font: font,
    color: blue,
  });

  page.drawText('DE PAGO', {
    x: page.getWidth() - 200,
    y: page.getHeight() - 80,
    size: textSize,
    font: font,
    color: blue,
  });

  // Ajuste del margen superior entre el número y el resto del contenido
  page.drawText(`Nro. ${nro}`, { // Convertir a string
    x: 50,
    y: page.getHeight() - logoHeight - 50, // Reducido el margen
    size: 15,
    font: fontBold,
    color: red,
  });

  // Definir la posición de las columnas
  const labelX = 50; // Posición de las etiquetas antes de los dos puntos
  const colonX = 180; // Posición de los dos puntos
  const lineHeight = 25; // Reducir el espacio entre líneas de texto

  const content = [
    { label: 'Fecha', value: `${day}/${month}/${year}`, y: page.getHeight() - logoHeight - 60 - lineHeight },
    { label: 'Recibí de', value: name.toUpperCase(), y: page.getHeight() - logoHeight - 60 - (2 * lineHeight) },
    { label: 'La suma de', value: ConversorNumeros.convertir(cash), y: page.getHeight() - logoHeight - 60 - (3 * lineHeight) },
    { label: 'Por concepto de', value: 'ASISTENCIA MEDICA DE EMERGENCIA', y: page.getHeight() - logoHeight - 60 - (4 * lineHeight) },
    { label: 'Gestion', value: anioseguro, y: page.getHeight() - logoHeight - 60 - (5 * lineHeight) },
    { label: 'Código', value: codigo_alumno.toUpperCase(), y: page.getHeight() - logoHeight - 60 - (6 * lineHeight) },
    { label: 'Curso', value: curso_alumno.toUpperCase(), y: page.getHeight() - logoHeight - 60 - (7 * lineHeight) },
  ];

  content.forEach(({ label, value, y }) => {
    if (label && value && y != null) {
      page.drawText(label, { x: labelX, y, size: 15, font: fontBold, color: blue });
      page.drawText(':', { x: colonX, y, size: 15, font: fontBold, color: blue });
      
      // Calcular el nuevo valorX para alinear los valores
      const adjustedValueX = colonX + 15; // Puedes ajustar el desplazamiento según sea necesario
      page.drawText(value.toString(), { x: adjustedValueX, y, size: 15, font: font, color: blue });
    } else {
      console.error('Algunos valores están indefinidos:', { label, value, y });
    }
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `${name.toUpperCase()}.pdf`);
};

export default DocumentoPDF;
