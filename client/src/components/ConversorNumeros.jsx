const ConversorNumeros = {
    UNIDADES: ["", "un ", "dos ", "tres ", "cuatro ", "cinco ", "seis ", "siete ", "ocho ", "nueve "],
    DECENAS: ["diez ", "once ", "doce ", "trece ", "catorce ", "quince ", "dieciséis ", "diecisiete ", "dieciocho ", "diecinueve", "veinte ", "treinta ", "cuarenta ", "cincuenta ", "sesenta ", "setenta ", "ochenta ", "noventa "],
    CENTENAS: ["", "ciento ", "doscientos ", "trecientos ", "cuatrocientos ", "quinientos ", "seiscientos ", "setecientos ", "ochocientos ", "novecientos "],
  
    convertir: function(numero, mayusculas) {
      let literal = "";
      let parteDecimal;
  
      numero = numero.replace(".", ",");
  
      if (!numero.includes(",")) {
        numero = numero + ",00";
      }
  
      const regex = /^\d{1,9},\d{1,2}$/;
      if (regex.test(numero)) {
        const [parteEntera, parteDecimal] = numero.split(",");
  
        parteDecimal = `${parteDecimal}/100 Bolivianos.`;
  
        if (parseInt(parteEntera) === 0) {
          literal = "cero ";
        } else if (parseInt(parteEntera) > 999999) {
          literal = this.getMillones(parteEntera);
        } else if (parseInt(parteEntera) > 999) {
          literal = this.getMiles(parteEntera);
        } else if (parseInt(parteEntera) > 99) {
          literal = this.getCentenas(parteEntera);
        } else if (parseInt(parteEntera) > 9) {
          literal = this.getDecenas(parteEntera);
        } else {
          literal = this.getUnidades(parteEntera);
        }
  
        return mayusculas ? (literal + parteDecimal).toUpperCase() : literal + parteDecimal;
      } else {
        return null;
      }
    },
  
    getUnidades: function(numero) {
      return this.UNIDADES[parseInt(numero.charAt(numero.length - 1))];
    },
  
    getDecenas: function(numero) {
      const n = parseInt(numero);
      if (n < 10) {
        return this.getUnidades(numero);
      } else if (n > 19) {
        const u = this.getUnidades(numero);
        return u === "" ? this.DECENAS[parseInt(numero.charAt(0)) + 8] : this.DECENAS[parseInt(numero.charAt(0)) + 8] + "y " + u;
      } else {
        return this.DECENAS[n - 10];
      }
    },
  
    getCentenas: function(numero) {
      if (parseInt(numero) > 99) {
        return parseInt(numero) === 100 ? "cien " : this.CENTENAS[parseInt(numero.charAt(0))] + this.getDecenas(numero.slice(1));
      } else {
        return this.getDecenas(numero);
      }
    },
  
    getMiles: function(numero) {
      const c = numero.slice(-3);
      const m = numero.slice(0, -3);
      return parseInt(m) > 0 ? this.getCentenas(m) + "mil " + this.getCentenas(c) : this.getCentenas(c);
    },
  
    getMillones: function(numero) {
      const miles = numero.slice(-6);
      const millon = numero.slice(0, -6);
      return millon.length > 1 ? this.getCentenas(millon) + "millones " : this.getUnidades(millon) + "millon " + this.getMiles(miles);
    }
  };
  
  export default ConversorNumeros;
  