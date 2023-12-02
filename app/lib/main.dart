import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: LoginPage(),
    );
  }
}

class LoginPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                _showLoginPopup(context);
              },
              child: Text('Login'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                _showRegisterPopup(context);
              },
              child: Text('Cadastrar'),
            ),
            SizedBox(height: 20),
            TextButton(
              onPressed: () {
                _showForgotPasswordPopup(context);
              },
              child: Text('Esqueceu sua senha?'),
            ),
          ],
        ),
      ),
    );
  }

  void _showLoginPopup(BuildContext context) {
    TextEditingController emailController = TextEditingController();
    TextEditingController senhaController = TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Login'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: emailController,
                decoration: InputDecoration(labelText: 'Email'),
              ),
              TextField(
                controller: senhaController,
                obscureText: true,
                decoration: InputDecoration(labelText: 'Senha'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Fechar'),
            ),
            ElevatedButton(
              onPressed: () async {
                String email = emailController.text;
                String senha = senhaController.text;

                final response = await http.post(
                  Uri.parse('http://localhost:8000/login'),
                  body: {'email': email, 'password': senha},
                );

                if (response.statusCode == 200) {
                  final token = jsonDecode(response.body)['token'];
                  print('Token: $token');

                  Navigator.of(context).pop();
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => DashboardPage()),
                  );
                } else {
                  print('Credenciais inválidas');
                }
              },
              child: Text('Login'),
            ),
          ],
        );
      },
    );
  }

  void _showRegisterPopup(BuildContext context) {
  TextEditingController nomeController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController senhaController = TextEditingController();
  TextEditingController confirmSenhaController = TextEditingController();
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Cadastrar'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nomeController,
                decoration: InputDecoration(labelText: 'Nome'),
              ),
              TextField(
                controller: emailController,
                decoration: InputDecoration(labelText: 'Email'),
              ),
              TextField(
                controller: senhaController,
                obscureText: true,
                decoration: InputDecoration(labelText: 'Senha'),
              ),
              TextField(
                controller: confirmSenhaController,
                obscureText: true,
                decoration: InputDecoration(labelText: 'Confirmação de Senha'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Fechar'),
            ),
            ElevatedButton(
              onPressed: () async {
                String nome = nomeController.text;
                String email = emailController.text;
                String senha = senhaController.text;
                String confirmSenha = confirmSenhaController.text;

                if ( senha != confirmSenha){
                  print('Senhas não coincidem');
                return;
                }
                final response = await http.post(Uri.parse('http://localhost:8080/cadastrar'),
                body: {'nome': nome, 'email': email, 'password': senha},
                );

                if (response.statusCode == 200){
                  final token = jsonDecode(response.body)['token'];
                  AuthManager.setUserIdFromToken(token);
                }

                Navigator.of(context).pop();
              },
              
              child: Text('Cadastrar'),
            ),
          ],
        );
      },
    );
  }

  void _showForgotPasswordPopup(BuildContext context) {
    TextEditingController emailController = TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Esqueceu sua senha?'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: emailController,
                decoration: InputDecoration(labelText: 'Email'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Fechar'),
            ),
            ElevatedButton(
              onPressed: () async {
                String email = emailController.text;

                final response = await http.post(
                  Uri.parse('http://localhost:8000/forgot-password'),
                  body: {'email': email},
                );

                if (response.statusCode == 200) {
                  print('Email de recuperação enviado com sucesso!');
                } else {
                  print(
                      'Falha ao enviar o email de recuperação. Status code: ${response.statusCode}');
                }

                Navigator.of(context).pop();
              },
              child: Text('Enviar'),
            ),
          ],
        );
      },
    );
  }
}

class AuthManager {
  static int? userId;

  static void setUserIdFromToken(String token) {
    userId = extractUserIdFromToken(token);
  }

  static int extractUserIdFromToken(String token) {
    final Map<String, dynamic> tokenData = jsonDecode(token);
    return tokenData['id'];
  }
}

class DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Text(
                'Menu Lateral',
                style: TextStyle(
                  color: Colors.white,
                ),
              ),
            ),
            ListTile(
              title: Text('Prontuários'),
              onTap: () async {
                await _showProntuariosPopup(context);
              },
            ),
            ListTile(
              title: Text('Receitas Médicas'),
              onTap: () async {
                await _showReceitasPopup(context);
              },
            ),
            ListTile(
              title: Text('Atestados'),
              onTap: () async {
                await _showReceitasPopup(context);
              },
            ),
          ],
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: 20),
            // _buildAppointmentsWidget(),
          ],
        ),
      ),
    );
  }

  void _showPopup(BuildContext context, String content) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(content),
          content: Text('$content'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Fechar'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _showProntuariosPopup(BuildContext context) async {
    try {
      final response = await http.get(
        Uri.parse(
            'http://localhost:8000/consultas/prontuarios/${AuthManager.userId}'),
      );

      if (response.statusCode == 200) {
        final prontuarios = jsonDecode(response.body)['prontuarios'];
        _showPopup(context, prontuarios.toString());
      } else {
        print('Erro ao obter prontuários. Status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Erro ao obter prontuários: $error');
    }
  }

  Future<void> _showReceitasPopup(BuildContext context) async {
    try {
      final response = await http.get(
        Uri.parse(
            'http://localhost:8000/consultas/receitas/${AuthManager.userId}'),
      );

      if (response.statusCode == 200) {
        final receitasMedicas = jsonDecode(response.body)['receitasMedicas'];
        _showPopup(context, receitasMedicas.toString());
      } else {
        print(
            'Erro ao obter receitas médicas. Status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Erro ao obter receitas médicas: $error');
    }
  }

  Future<void> _showAtestadosPopup(BuildContext context) async {
    try {
      final response = await http.get(
        Uri.parse(
            'http://localhost:8000/consultas/atestados/${AuthManager.userId}'),
      );

      if (response.statusCode == 200) {
        final atestados = jsonDecode(response.body)['atestados'];
        _showPopup(context, atestados.toString());
      } else {
        print('Erro ao obter atestados. Status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Erro ao obter atestados: $error');
    }
  }
}
