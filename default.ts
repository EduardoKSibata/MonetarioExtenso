import { Pipe } from '@angular/core';

@Pipe({
  name: 'MonetarioExtenso'
})
export class MonetarioExtenso {
  transform(value: number): string {

    if (value !== null && value !== undefined) {
      return this.valorExtenso(value);
    }
    else {
      return "zero";
    }
  }

  valorExtenso(valor: number, camelCase: boolean = true) {
    let isNegative: boolean = valor < 0;

    if (valor === 0)
      return "zero";

    // Setorização de valores
    // Arredondamento de decimais para manter as casas
    let decimalValue: number = Math.round((valor % 1 + Number.EPSILON) * 100);

    // Obtem somente as casas antes dos decimais
    const vlrStr: string = valor.toFixed(2);
    let valorStr: string = vlrStr.substr(0, vlrStr.length - 3);

    // Obtem as partes do valor
    let numSection: number = Math.ceil(valorStr.length / 3);
    let sections: string[] = [];

    // Inclui os centavos
    sections.push(decimalValue.toString());

    // Secciona os valores principais
    for (let i = 1; i <= numSection; i++) {
      if (i == numSection) {
        sections.push(
          valorStr.substr(0, valorStr.length - ((i - 1) * 3))
        );
      }
      else {
        sections.push(
          valorStr.substr(valorStr.length - (i * 3), 3)
        );
      }
    }

    // Monta os versos com base nas secoes
    let components: string[] = [];

    for (let i = 0; i < sections.length; i++) {
      components.push(
        this.formaFrase(sections[i], i + 1)
      );
    }

    components = components.filter(x => x !== undefined && x !== "");
    components.reverse();

    let ret: string = "";

    let lastItem: string[] = decimalValue > 0 ? components.splice(components.length - 1, 1) : [];

    if (components.length > 0 && lastItem.length > 0) {
      ret = components.join(", ") + " e " + lastItem[0]
    }
    else if(components.length > 1) {
      ret = components.join(", ");
    }
    else {
      ret = lastItem[0];
    }

    if (camelCase)
      ret = ret[0].toUpperCase() + ret.substring(1);

    return ret + (isNegative ? " negativo" : "");
  }

  formaFrase(section: string, tipo: number) {
    // Tipo
    // 1 => CENTAVOS
    // 2 => REAL
    // 3 => MILHAR
    // 4 => MILHÃO
    // 5 => BILHÃO
    let numbers: string[] = [];

    // Casos específicos
    if ((section.length === 2 && section[0] === "1") || (section.length === 3 && section === "100")) {
      numbers.push(this.traduzNumero(section, -1));
    }
    else if (section.length === 3 && section[1] === "1") {
      numbers.push(this.traduzNumero(section[0], 0));
      numbers.push(this.traduzNumero(section[1] + section[2], -1));
    }
    else {
      for (let i = section.length; i > 0; i--) {
        const currentIndex: number = 3 - i;
        numbers.push(this.traduzNumero(section[section.length - i], currentIndex));
      }
    }

    let typeText: string = "";

    switch (tipo) {
      case 1:
      	typeText = section != "1" ? "centavos" : "centavo";
        break;
      case 2:
        typeText = section != "1" ? "reais" : "real";
        break;
      case 3:
        typeText = "mil";
        break;
      case 4:
        typeText = section != "1" ? "milhões" : "milhão";
        break;
      case 5:
        typeText = section != "1" ? "bilhões" : "bilhão";
        break;
    }

    numbers = numbers.filter(x => x !== undefined && x !== "");

    return numbers.length !== 0 ? numbers.join(" e ") + " " + typeText : "";
  }

  traduzNumero(num: string, place: number) {

    switch (num) {
      case "100":
        return "cem";
      case "0":
        return "";
      case "10":
        return "dez";
      case "11":
        return "onze";
      case "12":
        return "doze";
      case "13":
        return "treze";
      case "14":
        return "quatorze";
      case "15":
        return "quinze";
      case "16":
        return "dezeseis";
      case "17":
        return "dezessete";
      case "18":
        return "dezoito";
      case "19":
        return "dezenove";
      case "1":
        switch (place) {
          case 0:
            return "cento";
          case 2:
            return "um";
        }
        break;
      case "2":
        switch (place) {
          case 0:
            return "duzentos";
          case 1:
            return "vinte";
          case 2:
            return "dois";
        }
        break;
      case "3":
        switch (place) {
          case 0:
            return "trezentos";
          case 1:
            return "trinta";
          case 2:
            return "três";
        }
        break;
      case "4":
        switch (place) {
          case 0:
            return "quatrocentos";
          case 1:
            return "quarenta";
          case 2:
            return "quatro";
        }
        break;
      case "5":
        switch (place) {
          case 0:
            return "quinhentos";
          case 1:
            return "cinquenta";
          case 2:
            return "cinco";
        }
        break;
      case "6":
        switch (place) {
          case 0:
            return "seiscentos";
          case 1:
            return "sessenta";
          case 2:
            return "seis";
        }
        break;
      case "7":
        switch (place) {
          case 0:
            return "setecentos";
          case 1:
            return "setenta";
          case 2:
            return "sete";
        }
        break;
      case "8":
        switch (place) {
          case 0:
            return "oitocentos";
          case 1:
            return "oitenta";
          case 2:
            return "oito";
        }
        break;
      case "9":
        switch (place) {
          case 0:
            return "novecentos";
          case 1:
            return "noventa";
          case 2:
            return "nove";
        }
        break;
    }
  }
}
