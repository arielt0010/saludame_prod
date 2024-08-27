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

  page.drawText(`Nro. ${nro}`, {
    x: 50,
    y: page.getHeight() - logoHeight - 50,
    size: 15,
    font: font,
    color: red,
  });

  const margin = 10; // Margen adicional para el espacio
  const content = [
    { text: `Fecha: ${day} de ${month} del ${year}`, x: 50, y: page.getHeight() - logoHeight - 180 - margin, color: blue },
    { text: `He recibido del Alumno(a): ${name.toUpperCase()}`, x: 50, y: page.getHeight() - logoHeight - 210 - margin, color: blue },
    { text: `La suma de: ${ConversorNumeros.convertir(cash)}`, x: 50, y: page.getHeight() - logoHeight - 240 - margin, color: blue },
    { text: `Por concepto de: ASISTENCIA MEDICA DE EMERGENCIA`, x: 50, y: page.getHeight() - logoHeight - 270 - margin, color: blue },
    { text: `Gestion: ${anioseguro}`, x: 50, y: page.getHeight() - logoHeight - 300 - margin, color: blue },
    { text: `Codigo del alumno: ${codigo_alumno.toUpperCase()}`, x: 50, y: page.getHeight() - logoHeight - 330 - margin, color: blue },
    { text: `Curso: ${curso_alumno.toUpperCase()}`, x: 50, y: page.getHeight() - logoHeight - 360 - margin, color: blue },
  ];

  content.forEach(({ text, x, y, color }) => {
    page.drawText(text, { x, y, size: 15, font: font, color });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `${name.toUpperCase()}.pdf`);
};

export default DocumentoPDF;
