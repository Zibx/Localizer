### TODO: rewrite docs with meteor and nonmeteor examples

# Localizer
## This project is bringing you one of the best js localization toolset.

### Production ready localization must contain at least 4 features:
- Generate simultanious language maps for each language, so UK user doesn't want to give any fucks about arabic, celtic and other locales. Especcially if he uses slow internet connection.
- Resolve plural forms. It doesn't looks as a problem in english where you can just check !== 1 to choose correct one, but in russian, arabic and lots of other languages it is not so easy.
- Hierarchical structure. So your programmer that is responsible for welcome screen can make node 'welcome' and do whatever he wants there.
- Vocabulary reuse. What if you have 666 'OK' buttons and one sunny day you want to rename all of them to 'oook'?

### But if you start using Localizer right now!
- Tiny template system, you can even generate html!
- Modifiers, so you can capitalize or lowercase some sentences from vocabulary
- Blazingly fast speed. Locale for each language is precompiled and we use code generation for make everything even faster
- Conditions! So you can do programming while you are doing programming.
- Relative paths! You can make subnode that use properties of it's parent, so you can make standard text for some dialog greetings once and then - just use 'reuse' feature

### Installation

#### first
```bash
npm install localize.js -g

```

#### second
```bash
npm run-script Localizer

```