import 'package:flutter/material.dart';

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
              onPressed: () {
                // Adicione a lógica de autenticação aqui
                String email = emailController.text;
                String senha = senhaController.text;

                if (email == 'teste' && senha == 'teste') {
                  Navigator.of(context).pop(); // Fechar o popup de login
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => DashboardPage()),
                  );
                } else {
                  // Adicione tratamento de erro de login aqui
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
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Cadastrar'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: InputDecoration(labelText: 'Nome'),
              ),
              TextField(
                decoration: InputDecoration(labelText: 'Email'),
              ),
              TextField(
                obscureText: true,
                decoration: InputDecoration(labelText: 'Senha'),
              ),
              TextField(
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
              onPressed: () {
                // Adicione a lógica de cadastro aqui
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
              onPressed: () {
                // Adicione a lógica de recuperação de senha aqui
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
              onTap: () {
                _showPopup(context, 'Prontuários');
              },
            ),
            ListTile(
              title: Text('Receitas Médicas'),
              onTap: () {
                _showPopup(context, 'Receitas Médicas');
              },
            ),
            ListTile(
              title: Text('Atestados'),
              onTap: () {
                _showPopup(context, 'Atestados');
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
            _buildAppointmentsWidget(),
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
          content: Text('Conteúdo do $content vai aqui.'),
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

  Widget _buildAppointmentsWidget() {
    // Adicione a lógica para construir e exibir a lista de consultas agendadas
    return Column(
      children: [
        Text(
          'Consultas Agendadas:',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        ListTile(
          title: Text('Consulta Para pegar Trembolona'),
          subtitle: Text('Data: 01/01/2023'),
        ),
        ListTile(
          title: Text('Troca de sexo'),
          subtitle: Text('Data: 02/01/2023'),
        ),
        // Adicione mais itens conforme necessário
      ],
    );
  }
}
