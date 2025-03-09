import { request } from 'undici';

export class CpfLightService {
  private readonly baseUrl: string | undefined;
  private readonly authToken: string | null;
  private readonly tokenExpiration: string | null;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.CPF_LIGHT_API_PRD 
      : process.env.CPF_LIGHT_API_DEV;

    this.authToken = null;
    this.tokenExpiration = null; 
  }

  async authenticate() {
    try {
      console.log("entrou")
      const url = process.env.CPF_LIGTH_API_TOKEN?.toString();

      if(url === undefined) return;

      const { statusCode, body: responseBody } = await request(url, {
        method: 'POST',
        headers: 
        { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Authorization': 'Basic ' + Buffer.from("CLIENT_ID" + ":" + "CLIENT_SECRET").toString('base64'), 
        },
        body: "grant_type=client_credentials"
      });

      console.log(statusCode)
      console.log(JSON.parse(responseBody['body'] as unknown as string))
      if (statusCode !== 200) {
        throw new Error('Falha na autenticação com a Receita Federal');
      }

      const data = await responseBody.json();

      console.log("AQUI")
      console.log(data);
      // this.authToken = data.token;
      // this.tokenExpiration = Date.now() + data.expires_in * 1000; // Convertendo para timestamp

      return this.authToken;
    } catch (error) {
      console.error('Erro na autenticação com a Receita Federal:', error);
      throw error;
    }
  }

  // async getAuthToken() {
  //   // Se o token for inexistente ou estiver expirado, refaz a autenticação
  //   if (!this.authToken || Date.now() >= this.tokenExpiration) {
  //     await this.autenticar();
  //   }
  //   return this.authToken;
  // }

  async checkCpfData(cpf: string) {
    try {
      const url = `${this.baseUrl}/v1/cpf/${cpf}`;
      
      // Fazendo a requisição com Undici
      const { statusCode, body } = await request(url, { method: 'GET' });

      if (statusCode !== 200) {
        return { valid: false, message: 'Erro ao consultar CPF na Receita Federal' };
      }

      // const data = await body.json();

      // if (data.status !== 'OK') {
      //   return { valid: false, message: 'CPF inválido na Receita Federal' };
      // }

      return { valid: true };
    } catch (error) {
      console.error('Erro ao consultar CPF na Receita Federal:', error);
      return { valid: false, message: 'Erro na consulta à Receita Federal' };
    }
  }
}