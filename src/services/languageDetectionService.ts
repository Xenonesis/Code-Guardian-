/**
 * Enhanced Smart Language Detection Service
 * Ultra-accurate detection of programming languages, frameworks, and project types
 * using advanced pattern matching, AST analysis, and ML-inspired techniques
 */

export interface LanguageInfo {
  name: string;
  confidence: number;
  extensions: string[];
  category: 'programming' | 'markup' | 'config' | 'data' | 'documentation' | 'query' | 'shell';
  ecosystem?: string;
  version?: string;
  dialect?: string;
  features?: string[];
}

export interface FrameworkInfo {
  name: string;
  language: string;
  confidence: number;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'desktop' | 'testing' | 'build' | 'orm' | 'ui' | 'state';
  version?: string;
  ecosystem: string;
  dependencies?: string[];
  configFiles?: string[];
}

export interface ProjectStructure {
  type: 'web' | 'mobile' | 'desktop' | 'library' | 'microservice' | 'monorepo' | 'cli' | 'api' | 'game' | 'unknown';
  confidence: number;
  indicators: string[];
  architecture?: 'mvc' | 'mvvm' | 'component' | 'layered' | 'microservices' | 'serverless';
  patterns?: string[];
}

export interface DetectionResult {
  primaryLanguage: LanguageInfo;
  allLanguages: LanguageInfo[];
  frameworks: FrameworkInfo[];
  projectStructure: ProjectStructure;
  buildTools: string[];
  packageManagers: string[];
  totalFiles: number;
  analysisTime: number;
  accuracy: number;
  detectionMethod: string[];
  codeMetrics: CodeMetrics;
  dependencies: DependencyInfo[];
  securityProfile: SecurityProfile;
  qualityScore: number;
}

export interface CodeMetrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  complexity: number;
  maintainabilityIndex: number;
  technicalDebt: string;
  duplicateCodePercentage: number;
}

export interface DependencyInfo {
  name: string;
  version?: string;
  type: 'production' | 'development' | 'peer' | 'optional';
  ecosystem: string;
  vulnerabilities?: number;
  outdated?: boolean;
  license?: string;
}

export interface SecurityProfile {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  vulnerablePatterns: string[];
  securityFeatures: string[];
  complianceLevel: number;
  recommendations: string[];
}

export interface FileAnalysis {
  filename: string;
  extension: string;
  language: LanguageInfo;
  size: number;
  content?: string;
  encoding?: string;
  lineCount?: number;
  complexity?: number;
  maintainabilityIndex?: number;
  duplicateLines?: number;
  securityIssues?: number;
  testCoverage?: number;
  documentation?: number;
}

/**
 * Ultra-comprehensive language patterns with advanced detection
 */
const ENHANCED_LANGUAGE_PATTERNS = {
  // JavaScript & TypeScript
  javascript: {
    extensions: ['.js', '.mjs', '.cjs', '.jsx', '.es6', '.es'],
    patterns: [
      /\b(function|const|let|var|class|import|export|require)\b/g,
      /\b(console\.(log|error|warn|info)|document\.|window\.|global\.)\b/g,
      /\b(async|await|Promise|then|catch)\b/g,
      /=>\s*[\{\(]?/g,
      /\$\{[^}]*\}/g,
      /\b(Array|Object|String|Number|Boolean|Symbol|BigInt)\b/g,
      /\b(JSON\.(parse|stringify)|parseInt|parseFloat)\b/g,
      /\b(setTimeout|setInterval|clearTimeout|clearInterval)\b/g,
      /\b(addEventListener|removeEventListener)\b/g,
      /\b(prototype|constructor|instanceof|typeof)\b/g
    ],
    keywords: ['function', 'const', 'let', 'var', 'class', 'import', 'export', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super'],
    builtins: ['console', 'document', 'window', 'global', 'process', 'Buffer', 'require', 'module', 'exports'],
    category: 'programming' as const,
    ecosystem: 'web',
    features: ['dynamic-typing', 'first-class-functions', 'closures', 'prototypal-inheritance']
  },
  typescript: {
    extensions: ['.ts', '.tsx', '.d.ts', '.cts', '.mts'],
    patterns: [
      /\b(interface|type|enum|namespace|declare|abstract)\b/g,
      /:\s*(string|number|boolean|any|void|unknown|never|object|bigint|symbol)\b/g,
      /<[^<>]*>/g,
      /\b(public|private|protected|readonly|static|override)\b/g,
      /\b(implements|extends|keyof|typeof|infer|is|asserts)\b/g,
      /\b(Record|Partial|Required|Pick|Omit|Exclude|Extract|NonNullable|ReturnType|Parameters)\b/g,
      /\b(as\s+(const|any|unknown|never)|satisfies)\b/g,
      /\?\s*:/g,
      /\|\s*\w+/g,
      /&\s*\w+/g
    ],
    keywords: ['interface', 'type', 'enum', 'namespace', 'implements', 'extends', 'declare', 'abstract', 'readonly', 'keyof', 'typeof', 'infer', 'is', 'asserts', 'satisfies'],
    builtins: ['Array', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Date', 'RegExp', 'Error'],
    category: 'programming' as const,
    ecosystem: 'web',
    features: ['static-typing', 'generics', 'decorators', 'advanced-types']
  },
  python: {
    extensions: ['.py', '.pyw', '.pyi', '.pyx', '.py3', '.pyi3'],
    patterns: [
      /\b(def|class|import|from|if __name__ == ["']__main__["'])\b/g,
      /\b(print|len|range|enumerate|zip|map|filter|sorted|reversed)\b/g,
      /\bself\./g,
      /\b(try|except|finally|with|as|raise|assert)\b/g,
      /#.*$/gm,
      /\b(lambda|yield|yield from|async|await)\b/g,
      /\b(list|dict|tuple|set|frozenset|str|int|float|bool|bytes)\b/g,
      /\b(@\w+|@property|@staticmethod|@classmethod)\b/g,
      /\b(isinstance|issubclass|hasattr|getattr|setattr|delattr)\b/g,
      /\b(super|__init__|__str__|__repr__|__len__|__iter__)\b/g,
      /f["'][^"']*\{[^}]*\}[^"']*["']/g
    ],
    keywords: ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'try', 'except', 'finally', 'with', 'as', 'lambda', 'yield', 'async', 'await', 'return', 'pass', 'break', 'continue', 'for', 'while', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False'],
    builtins: ['print', 'len', 'range', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed', 'sum', 'min', 'max', 'abs', 'round', 'type', 'isinstance', 'hasattr', 'getattr', 'setattr', 'delattr', 'dir', 'vars', 'globals', 'locals'],
    category: 'programming' as const,
    ecosystem: 'backend',
    features: ['dynamic-typing', 'duck-typing', 'list-comprehensions', 'decorators', 'context-managers']
  },
  java: {
    extensions: ['.java', '.jav'],
    patterns: [
      /\b(public|private|protected|static|final|abstract|synchronized|volatile|transient|native)\b/g,
      /\b(class|interface|enum|package|import|record|sealed|permits)\b/g,
      /\b(System\.(out|err)\.(println|print)|String|int|boolean|void|long|double|float|char|byte|short)\b/g,
      /\b(extends|implements|throws|instanceof|new|this|super)\b/g,
      /@\w+/g,
      /\b(try|catch|finally|throw|throws)\b/g,
      /\b(ArrayList|HashMap|HashSet|LinkedList|TreeMap|TreeSet|Vector|Stack)\b/g,
      /\b(Optional|Stream|Collectors|Function|Predicate|Consumer|Supplier)\b/g,
      /\b(Override|Deprecated|SuppressWarnings|FunctionalInterface)\b/g,
      /\b(var|switch|case|default|break|continue|return|if|else|for|while|do)\b/g
    ],
    keywords: ['public', 'private', 'protected', 'class', 'interface', 'package', 'import', 'extends', 'implements', 'static', 'final', 'abstract', 'synchronized', 'volatile', 'transient', 'native', 'strictfp', 'enum', 'record', 'sealed', 'permits', 'var', 'new', 'this', 'super', 'instanceof', 'return', 'if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'throws'],
    builtins: ['System', 'String', 'Object', 'Class', 'Integer', 'Double', 'Boolean', 'Character', 'Byte', 'Short', 'Long', 'Float', 'Math', 'Arrays', 'Collections', 'List', 'Map', 'Set', 'Optional', 'Stream'],
    category: 'programming' as const,
    ecosystem: 'backend',
    features: ['static-typing', 'object-oriented', 'garbage-collection', 'platform-independent']
  },
  csharp: {
    extensions: ['.cs', '.csx', '.cake'],
    patterns: [
      /\b(using|namespace|class|interface|struct|enum|record|delegate)\b/g,
      /\b(public|private|protected|internal|static|readonly|const|virtual|override|abstract|sealed)\b/g,
      /\b(string|int|bool|void|var|object|decimal|double|float|long|short|byte|char|uint|ulong|ushort|sbyte)\b/g,
      /\b(Console\.(WriteLine|Write|ReadLine)|System\.|Microsoft\.)\b/g,
      /\[[^\]]*\]/g,
      /\b(async|await|Task|Task<|ValueTask|ConfigureAwait)\b/g,
      /\b(LINQ|IEnumerable|IQueryable|Select|Where|OrderBy|GroupBy|Join)\b/g,
      /\b(get|set|init|value|yield|return|ref|out|in|params)\b/g,
      /\b(try|catch|finally|throw|using|lock|checked|unchecked)\b/g,
      /\?\?|\?\.|\?\[|\?=/g
    ],
    keywords: ['using', 'namespace', 'class', 'interface', 'struct', 'enum', 'record', 'delegate', 'public', 'private', 'protected', 'internal', 'static', 'readonly', 'const', 'virtual', 'override', 'abstract', 'sealed', 'partial', 'async', 'await', 'yield', 'return', 'ref', 'out', 'in', 'params', 'get', 'set', 'init', 'value', 'new', 'this', 'base', 'typeof', 'sizeof', 'is', 'as', 'if', 'else', 'switch', 'case', 'default', 'for', 'foreach', 'while', 'do', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'using', 'lock', 'checked', 'unchecked'],
    builtins: ['Console', 'System', 'String', 'Object', 'Type', 'Array', 'List', 'Dictionary', 'HashSet', 'Queue', 'Stack', 'Task', 'Thread', 'DateTime', 'TimeSpan', 'Guid', 'Math', 'Convert', 'Enum', 'Attribute'],
    category: 'programming' as const,
    ecosystem: 'backend',
    features: ['static-typing', 'object-oriented', 'garbage-collection', 'generics', 'linq']
  },
  php: {
    extensions: ['.php', '.phtml', '.php3', '.php4', '.php5', '.php7', '.php8', '.phps', '.phar'],
    patterns: [
      /<\?php|<\?=/g,
      /\$\w+/g,
      /\b(function|class|interface|trait|namespace|abstract|final|static)\b/g,
      /\b(echo|print|var_dump|print_r|isset|empty|unset|die|exit)\b/g,
      /->/g,
      /::/g,
      /\b(public|private|protected|const|var)\b/g,
      /\b(extends|implements|use|as|insteadof)\b/g,
      /\b(try|catch|finally|throw|new|clone|instanceof)\b/g,
      /\b(array|object|string|int|float|bool|null|resource|callable|iterable|mixed)\b/g,
      /\b(__construct|__destruct|__call|__callStatic|__get|__set|__isset|__unset|__toString|__invoke|__clone)\b/g
    ],
    keywords: ['function', 'class', 'interface', 'trait', 'namespace', 'abstract', 'final', 'static', 'public', 'private', 'protected', 'const', 'var', 'extends', 'implements', 'use', 'as', 'insteadof', 'echo', 'print', 'return', 'if', 'else', 'elseif', 'endif', 'switch', 'case', 'default', 'endswitch', 'for', 'foreach', 'endfor', 'endforeach', 'while', 'endwhile', 'do', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'clone', 'instanceof', 'yield', 'yield from'],
    builtins: ['array', 'object', 'string', 'int', 'float', 'bool', 'null', 'resource', 'callable', 'iterable', 'mixed', 'count', 'sizeof', 'is_array', 'is_object', 'is_string', 'is_int', 'is_float', 'is_bool', 'is_null', 'is_resource', 'is_callable', 'json_encode', 'json_decode', 'serialize', 'unserialize', 'file_get_contents', 'file_put_contents', 'fopen', 'fclose', 'fread', 'fwrite'],
    category: 'programming' as const,
    ecosystem: 'web',
    features: ['dynamic-typing', 'server-side', 'web-focused', 'traits']
  },
  ruby: {
    extensions: ['.rb', '.rbw', '.rake', '.gemspec', '.ru', '.thor', '.rabl'],
    patterns: [
      /\b(def|class|module|end|require|require_relative|include|extend|prepend)\b/g,
      /\b(puts|print|p|pp|gets|readline)\b/g,
      /@\w+|@@\w+|\$\w+/g,
      /\b(if|unless|while|until|for|in|case|when|then|else|elsif|begin|rescue|ensure|retry)\b/g,
      /#.*$/gm,
      /\b(attr_reader|attr_writer|attr_accessor|private|protected|public)\b/g,
      /\b(yield|block_given\?|proc|lambda|->)\b/g,
      /\b(Array|Hash|String|Integer|Float|Symbol|Regexp|Range|Time|Date|File|Dir)\b/g,
      /\b(nil|true|false|self|super|__FILE__|__LINE__|__method__)\b/g,
      /:[a-zA-Z_]\w*/g,
      /\|[^|]*\|/g
    ],
    keywords: ['def', 'class', 'module', 'end', 'require', 'require_relative', 'include', 'extend', 'prepend', 'attr_reader', 'attr_writer', 'attr_accessor', 'private', 'protected', 'public', 'if', 'unless', 'while', 'until', 'for', 'in', 'case', 'when', 'then', 'else', 'elsif', 'begin', 'rescue', 'ensure', 'retry', 'return', 'break', 'next', 'redo', 'yield', 'super', 'self', 'nil', 'true', 'false', 'and', 'or', 'not'],
    builtins: ['puts', 'print', 'p', 'pp', 'gets', 'readline', 'Array', 'Hash', 'String', 'Integer', 'Float', 'Symbol', 'Regexp', 'Range', 'Time', 'Date', 'File', 'Dir', 'IO', 'Kernel', 'Object', 'Class', 'Module', 'Proc', 'Method', 'binding', 'caller', 'eval', 'exec', 'system', 'spawn'],
    category: 'programming' as const,
    ecosystem: 'backend',
    features: ['dynamic-typing', 'metaprogramming', 'blocks', 'mixins', 'duck-typing']
  },
  go: {
    extensions: ['.go'],
    patterns: [
      /\b(package|import|func|var|const|type|struct|interface|map|chan|go|defer|select)\b/g,
      /\b(fmt\.(Print|Printf|Println|Sprint|Sprintf|Sprintln|Fprint|Fprintf|Fprintln))\b/g,
      /\b(if|else|for|range|switch|case|default|fallthrough|break|continue|return|goto)\b/g,
      /\b(make|new|len|cap|append|copy|delete|close|panic|recover)\b/g,
      /\/\/.*$/gm,
      /\/\*[\s\S]*?\*\//g,
      /\b(string|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|uintptr|byte|rune|float32|float64|complex64|complex128|bool)\b/g,
      /\b(error|nil|true|false|iota)\b/g,
      /\b(context|sync|time|os|io|net|http|json|xml|sql|crypto|hash|sort|strconv|strings|bytes|bufio|regexp|path|filepath|flag|log)\b/g,
      /:=/g,
      /<-/g
    ],
    keywords: ['package', 'import', 'func', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan', 'go', 'defer', 'select', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'fallthrough', 'break', 'continue', 'return', 'goto', 'make', 'new', 'len', 'cap', 'append', 'copy', 'delete', 'close', 'panic', 'recover', 'nil', 'true', 'false', 'iota'],
    builtins: ['make', 'new', 'len', 'cap', 'append', 'copy', 'delete', 'close', 'panic', 'recover', 'print', 'println', 'complex', 'real', 'imag', 'string', 'int', 'uint', 'uintptr', 'byte', 'rune', 'float32', 'float64', 'complex64', 'complex128', 'bool', 'error'],
    category: 'programming' as const,
    ecosystem: 'backend',
    features: ['static-typing', 'compiled', 'garbage-collection', 'concurrency', 'channels']
  },
  rust: {
    extensions: ['.rs'],
    patterns: [
      /\b(fn|let|mut|const|static|struct|enum|impl|trait|type|where|unsafe|extern|async|await)\b/g,
      /\b(println!|print!|panic!|assert!|assert_eq!|assert_ne!|debug_assert!|unreachable!|unimplemented!|todo!)\b/g,
      /\b(match|if|else|while|for|loop|break|continue|return)\b/g,
      /\b(pub|use|mod|crate|self|super|as|dyn|move|ref|box)\b/g,
      /\/\/.*$/gm,
      /\/\*[\s\S]*?\*\//g,
      /\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String)\b/g,
      /\b(Option|Some|None|Result|Ok|Err|Vec|HashMap|HashSet|BTreeMap|BTreeSet)\b/g,
      /\b(Clone|Copy|Debug|Default|PartialEq|Eq|PartialOrd|Ord|Hash|Send|Sync|Sized|Drop)\b/g,
      /&(mut\s+)?\w+|&'\w+\s+\w+/g,
      /'\w+/g,
      /->/g
    ],
    keywords: ['fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl', 'trait', 'type', 'where', 'unsafe', 'extern', 'async', 'await', 'pub', 'use', 'mod', 'crate', 'self', 'super', 'as', 'dyn', 'move', 'ref', 'box', 'match', 'if', 'else', 'while', 'for', 'loop', 'break', 'continue', 'return', 'true', 'false'],
    builtins: ['println', 'print', 'panic', 'assert', 'assert_eq', 'assert_ne', 'debug_assert', 'unreachable', 'unimplemented', 'todo', 'Option', 'Some', 'None', 'Result', 'Ok', 'Err', 'Vec', 'String', 'str', 'i32', 'u32', 'f64', 'bool', 'char'],
    category: 'programming' as const,
    ecosystem: 'backend',
    features: ['static-typing', 'memory-safety', 'zero-cost-abstractions', 'ownership', 'borrowing']
  },
  cpp: {
    extensions: ['.cpp', '.cxx', '.cc', '.c++', '.hpp', '.hxx', '.h++', '.hh', '.C', '.H'],
    patterns: [
      /\b(#include|#define|#ifdef|#ifndef|#if|#else|#elif|#endif|#pragma)\b/g,
      /\b(class|struct|namespace|template|typename|concept|requires|constexpr|consteval|constinit)\b/g,
      /\b(std::|cout|cin|endl|cerr|clog|string|vector|map|set|unordered_map|unordered_set|array|deque|list|queue|stack|priority_queue)\b/g,
      /\b(public|private|protected|virtual|override|final|static|const|mutable|volatile|explicit|inline|friend|extern)\b/g,
      /\/\/.*$/gm,
      /\/\*[\s\S]*?\*\//g,
      /\b(auto|decltype|nullptr|true|false|this|new|delete|sizeof|typeid|dynamic_cast|static_cast|const_cast|reinterpret_cast)\b/g,
      /\b(try|catch|throw|noexcept|exception)\b/g,
      /\b(int|char|float|double|void|bool|long|short|signed|unsigned|wchar_t|char16_t|char32_t|size_t|ptrdiff_t)\b/g,
      /\b(if|else|switch|case|default|for|while|do|break|continue|return|goto)\b/g,
      /::/g,
      /->/g
    ],
    keywords: ['class', 'struct', 'namespace', 'template', 'typename', 'concept', 'requires', 'constexpr', 'consteval', 'constinit', 'public', 'private', 'protected', 'virtual', 'override', 'final', 'static', 'const', 'mutable', 'volatile', 'explicit', 'inline', 'friend', 'extern', 'auto', 'decltype', 'nullptr', 'true', 'false', 'this', 'new', 'delete', 'sizeof', 'typeid', 'try', 'catch', 'throw', 'noexcept', 'if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do', 'break', 'continue', 'return', 'goto'],
    builtins: ['std', 'cout', 'cin', 'cerr', 'clog', 'endl', 'string', 'vector', 'map', 'set', 'unordered_map', 'unordered_set', 'array', 'deque', 'list', 'queue', 'stack', 'priority_queue', 'pair', 'tuple', 'shared_ptr', 'unique_ptr', 'weak_ptr', 'make_shared', 'make_unique'],
    category: 'programming' as const,
    ecosystem: 'backend',
    features: ['static-typing', 'manual-memory-management', 'templates', 'multiple-inheritance', 'operator-overloading']
  },
  c: {
    extensions: ['.c', '.h'],
    patterns: [
      /\b(#include|#define|#ifdef|#ifndef|#if|#else|#elif|#endif|#pragma|#undef|#line|#error|#warning)\b/g,
      /\b(int|char|float|double|void|struct|union|enum|typedef|static|extern|register|auto|const|volatile|restrict|inline)\b/g,
      /\b(printf|scanf|fprintf|fscanf|sprintf|sscanf|malloc|calloc|realloc|free|memcpy|memset|strlen|strcpy|strcat|strcmp)\b/g,
      /\b(if|else|while|for|do|switch|case|default|break|continue|return|goto)\b/g,
      /\/\*[\s\S]*?\*\/|\/\/.*$/gm,
      /\b(signed|unsigned|short|long|size_t|ptrdiff_t|NULL|true|false)\b/g,
      /\b(FILE|stdin|stdout|stderr|EOF)\b/g,
      /\b(sizeof|offsetof|alignof|_Alignas|_Alignof|_Atomic|_Static_assert|_Noreturn|_Thread_local|_Generic)\b/g,
      /->|\.|&|\*|\[|\]/g
    ],
    keywords: ['int', 'char', 'float', 'double', 'void', 'struct', 'union', 'enum', 'typedef', 'static', 'extern', 'register', 'auto', 'const', 'volatile', 'restrict', 'inline', 'signed', 'unsigned', 'short', 'long', 'if', 'else', 'while', 'for', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'goto', 'sizeof'],
    builtins: ['printf', 'scanf', 'fprintf', 'fscanf', 'sprintf', 'sscanf', 'malloc', 'calloc', 'realloc', 'free', 'memcpy', 'memset', 'memmove', 'memcmp', 'strlen', 'strcpy', 'strncpy', 'strcat', 'strncat', 'strcmp', 'strncmp', 'strchr', 'strstr', 'strtok', 'atoi', 'atof', 'atol', 'strtol', 'strtod', 'fopen', 'fclose', 'fread', 'fwrite', 'fseek', 'ftell', 'rewind', 'feof', 'ferror'],
    category: 'programming' as const,
    ecosystem: 'backend',
    features: ['static-typing', 'manual-memory-management', 'low-level', 'portable']
  },

  // Additional Languages
  kotlin: {
    extensions: ['.kt', '.kts'],
    patterns: [
      /\b(fun|class|interface|object|data|sealed|enum|annotation)\b/g,
      /\b(val|var|const|lateinit|by|delegate)\b/g,
      /\b(public|private|protected|internal|open|final|abstract|override|companion)\b/g,
      /\b(if|else|when|for|while|do|break|continue|return|try|catch|finally|throw)\b/g,
      /\b(String|Int|Long|Float|Double|Boolean|Char|Byte|Short|Any|Unit|Nothing)\b/g,
      /\b(listOf|arrayOf|mapOf|setOf|mutableListOf|mutableMapOf|mutableSetOf)\b/g,
      /\?\.|\?:|\?\?/g,
      /\b(it|this|super|null|true|false)\b/g
    ],
    keywords: ['fun', 'class', 'interface', 'object', 'data', 'sealed', 'enum', 'annotation', 'val', 'var', 'const', 'lateinit', 'by', 'delegate', 'public', 'private', 'protected', 'internal', 'open', 'final', 'abstract', 'override', 'companion', 'if', 'else', 'when', 'for', 'while', 'do', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'it', 'this', 'super', 'null', 'true', 'false'],
    builtins: ['String', 'Int', 'Long', 'Float', 'Double', 'Boolean', 'Char', 'Byte', 'Short', 'Any', 'Unit', 'Nothing', 'List', 'Map', 'Set', 'Array', 'println', 'print', 'readLine', 'TODO'],
    category: 'programming' as const,
    ecosystem: 'mobile',
    features: ['static-typing', 'null-safety', 'interop-java', 'coroutines']
  },

  swift: {
    extensions: ['.swift'],
    patterns: [
      /\b(func|class|struct|enum|protocol|extension|typealias)\b/g,
      /\b(var|let|static|lazy|weak|unowned|override|final|open|public|internal|fileprivate|private)\b/g,
      /\b(if|else|guard|switch|case|default|for|while|repeat|break|continue|return|throw|try|catch|defer)\b/g,
      /\b(String|Int|Double|Float|Bool|Character|Array|Dictionary|Set|Optional)\b/g,
      /\b(print|debugPrint|dump|readLine)\b/g,
      /\?\.|\?\?|!/g,
      /\b(self|super|nil|true|false)\b/g,
      /@\w+/g
    ],
    keywords: ['func', 'class', 'struct', 'enum', 'protocol', 'extension', 'typealias', 'var', 'let', 'static', 'lazy', 'weak', 'unowned', 'override', 'final', 'open', 'public', 'internal', 'fileprivate', 'private', 'if', 'else', 'guard', 'switch', 'case', 'default', 'for', 'while', 'repeat', 'break', 'continue', 'return', 'throw', 'try', 'catch', 'defer', 'self', 'super', 'nil', 'true', 'false'],
    builtins: ['String', 'Int', 'Double', 'Float', 'Bool', 'Character', 'Array', 'Dictionary', 'Set', 'Optional', 'print', 'debugPrint', 'dump', 'readLine', 'abs', 'min', 'max', 'stride'],
    category: 'programming' as const,
    ecosystem: 'mobile',
    features: ['static-typing', 'optional-types', 'arc', 'protocol-oriented']
  },

  dart: {
    extensions: ['.dart'],
    patterns: [
      /\b(class|abstract|interface|mixin|enum|extension|typedef)\b/g,
      /\b(var|final|const|late|static|covariant)\b/g,
      /\b(public|private|protected|factory|operator|get|set)\b/g,
      /\b(if|else|switch|case|default|for|while|do|break|continue|return|try|catch|finally|throw|rethrow)\b/g,
      /\b(String|int|double|num|bool|List|Map|Set|Iterable|Future|Stream)\b/g,
      /\b(print|debugPrint|assert)\b/g,
      /\b(async|await|yield|sync)\b/g,
      /\b(this|super|null|true|false)\b/g,
      /\?\.|\?\?|\?/g
    ],
    keywords: ['class', 'abstract', 'interface', 'mixin', 'enum', 'extension', 'typedef', 'var', 'final', 'const', 'late', 'static', 'covariant', 'factory', 'operator', 'get', 'set', 'if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'rethrow', 'async', 'await', 'yield', 'sync', 'this', 'super', 'null', 'true', 'false'],
    builtins: ['String', 'int', 'double', 'num', 'bool', 'List', 'Map', 'Set', 'Iterable', 'Future', 'Stream', 'Duration', 'DateTime', 'RegExp', 'Uri', 'print', 'debugPrint', 'assert', 'identical'],
    category: 'programming' as const,
    ecosystem: 'mobile',
    features: ['static-typing', 'null-safety', 'async-await', 'mixins']
  },

  // Web Technologies
  html: {
    extensions: ['.html', '.htm', '.xhtml', '.shtml'],
    patterns: [
      /<\/?[a-zA-Z][^>]*>/g,
      /<!DOCTYPE\s+html>/gi,
      /<!--[\s\S]*?-->/g,
      /\b(class|id|src|href|alt|title|style|onclick|onload|onchange)\s*=/g,
      /<(html|head|body|div|span|p|a|img|script|style|link|meta|title)\b/gi
    ],
    keywords: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style', 'link', 'meta', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'select', 'option', 'textarea'],
    builtins: ['class', 'id', 'src', 'href', 'alt', 'title', 'style', 'onclick', 'onload', 'onchange', 'data-', 'aria-'],
    category: 'markup' as const,
    ecosystem: 'web',
    features: ['markup', 'semantic', 'accessibility', 'responsive']
  },

  css: {
    extensions: ['.css', '.scss', '.sass', '.less', '.styl'],
    patterns: [
      /[.#]?[a-zA-Z][a-zA-Z0-9_-]*\s*\{/g,
      /[a-zA-Z-]+\s*:\s*[^;]+;/g,
      /@(media|import|keyframes|font-face|supports|namespace)/g,
      /\b(color|background|margin|padding|border|width|height|font|display|position|flex|grid)\b/g,
      /\b(px|em|rem|vh|vw|%|pt|pc|in|cm|mm|ex|ch|vmin|vmax|fr)\b/g
    ],
    keywords: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'font', 'display', 'position', 'flex', 'grid', 'transform', 'transition', 'animation', 'opacity', 'z-index', 'overflow', 'float', 'clear'],
    builtins: ['inherit', 'initial', 'unset', 'auto', 'none', 'block', 'inline', 'inline-block', 'flex', 'grid', 'absolute', 'relative', 'fixed', 'sticky', 'static'],
    category: 'markup' as const,
    ecosystem: 'web',
    features: ['styling', 'responsive', 'animations', 'grid', 'flexbox']
  },

  // Configuration & Data
  json: {
    extensions: ['.json', '.jsonc', '.json5'],
    patterns: [
      /\{[\s\S]*\}/g,
      /\[[\s\S]*\]/g,
      /"[^"]*"\s*:/g,
      /:\s*("[^"]*"|\d+|true|false|null)/g
    ],
    keywords: ['true', 'false', 'null'],
    builtins: [],
    category: 'data' as const,
    ecosystem: 'universal',
    features: ['data-interchange', 'lightweight', 'human-readable']
  },

  yaml: {
    extensions: ['.yaml', '.yml'],
    patterns: [
      /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*:/gm,
      /^\s*-\s+/gm,
      /\|\s*$/gm,
      />\s*$/gm,
      /^---\s*$/gm,
      /^\.\.\.\.\s*$/gm
    ],
    keywords: ['true', 'false', 'null', 'yes', 'no', 'on', 'off'],
    builtins: [],
    category: 'data' as const,
    ecosystem: 'universal',
    features: ['human-readable', 'configuration', 'serialization']
  },

  xml: {
    extensions: ['.xml', '.xsd', '.xsl', '.xslt', '.svg', '.rss', '.atom'],
    patterns: [
      /<\?xml[^>]*\?>/g,
      /<\/?[a-zA-Z][^>]*>/g,
      /<!--[\s\S]*?-->/g,
      /<\![CDATA\[[\s\S]*?\]\]>/g
    ],
    keywords: [],
    builtins: ['version', 'encoding', 'standalone'],
    category: 'markup' as const,
    ecosystem: 'universal',
    features: ['structured-data', 'extensible', 'namespaces']
  },

  // Shell & Scripts
  bash: {
    extensions: ['.sh', '.bash', '.zsh', '.fish', '.ksh', '.csh'],
    patterns: [
      /^#!/gm,
      /\$\{?[a-zA-Z_][a-zA-Z0-9_]*\}?/g,
      /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|break|continue)\b/g,
      /\b(echo|printf|read|cd|ls|pwd|mkdir|rmdir|rm|cp|mv|chmod|chown|grep|sed|awk|sort|uniq|head|tail|cat|less|more)\b/g,
      /#.*$/gm
    ],
    keywords: ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'exit', 'break', 'continue', 'in', 'select', 'until', 'time', 'coproc'],
    builtins: ['echo', 'printf', 'read', 'cd', 'pwd', 'export', 'unset', 'alias', 'unalias', 'history', 'jobs', 'bg', 'fg', 'nohup', 'disown', 'suspend', 'wait', 'kill', 'trap', 'source', 'eval', 'exec', 'shift', 'getopts'],
    category: 'shell' as const,
    ecosystem: 'unix',
    features: ['scripting', 'automation', 'system-administration']
  },

  // Database
  sql: {
    extensions: ['.sql', '.ddl', '.dml'],
    patterns: [
      /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|MERGE|UPSERT)\b/gi,
      /\b(FROM|WHERE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET)\b/gi,
      /\b(TABLE|INDEX|VIEW|PROCEDURE|FUNCTION|TRIGGER|DATABASE|SCHEMA)\b/gi,
      /\b(INT|INTEGER|VARCHAR|CHAR|TEXT|DATE|DATETIME|TIMESTAMP|DECIMAL|FLOAT|DOUBLE|BOOLEAN|BLOB)\b/gi,
      /\b(PRIMARY KEY|FOREIGN KEY|UNIQUE|NOT NULL|DEFAULT|CHECK|CONSTRAINT)\b/gi,
      /--.*$/gm,
      /\/\*[\s\S]*?\*\//g
    ],
    keywords: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TRUNCATE', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'INTERSECT', 'EXCEPT', 'AS', 'DISTINCT', 'ALL', 'EXISTS', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'AND', 'OR', 'NOT'],
    builtins: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'UPPER', 'LOWER', 'SUBSTRING', 'LENGTH', 'TRIM', 'COALESCE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'CAST', 'CONVERT', 'NOW', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP'],
    category: 'query' as const,
    ecosystem: 'database',
    features: ['declarative', 'set-based', 'acid-transactions']
  }
};

export class LanguageDetectionService {
  private fileAnalyses: FileAnalysis[] = [];
  private startTime: number = 0;
  private detectionMethods: string[] = [];
  private accuracyScore: number = 0;
  private codeMetrics: CodeMetrics = {
    totalLines: 0,
    codeLines: 0,
    commentLines: 0,
    blankLines: 0,
    complexity: 0,
    maintainabilityIndex: 0,
    technicalDebt: '0h',
    duplicateCodePercentage: 0
  };
  private dependencies: DependencyInfo[] = [];
  private securityProfile: SecurityProfile = {
    riskLevel: 'low',
    vulnerablePatterns: [],
    securityFeatures: [],
    complianceLevel: 100,
    recommendations: []
  };
  private qualityScore: number = 0;

  /**
   * Analyze a codebase and detect languages, frameworks, and project structure
   */
  public async analyzeCodebase(files: { filename: string; content: string }[]): Promise<DetectionResult> {
    this.startTime = Date.now();
    this.fileAnalyses = [];
    this.detectionMethods = [];
    this.accuracyScore = 0;

    // Enhanced file analysis with multiple detection methods
    for (const file of files) {
      const analysis = this.analyzeFileEnhanced(file.filename, file.content);
      this.fileAnalyses.push(analysis);
    }

    // Detect languages
    const allLanguages = this.detectLanguages();
    const primaryLanguage = this.determinePrimaryLanguage(allLanguages);

    // Detect frameworks
    const frameworks = this.detectFrameworks();

    // Analyze project structure
    const projectStructure = this.analyzeProjectStructure();

    // Detect build tools and package managers
    const buildTools = this.detectBuildTools();
    const packageManagers = this.detectPackageManagers();

    const analysisTime = Date.now() - this.startTime;

    // Calculate advanced metrics
    this.accuracyScore = this.calculateAccuracyScore(allLanguages, frameworks);
    this.codeMetrics = this.calculateCodeMetrics();
    this.dependencies = this.analyzeDependencies();
    this.securityProfile = this.analyzeSecurityProfile();
    this.qualityScore = this.calculateQualityScore();

    return {
      primaryLanguage,
      allLanguages,
      frameworks,
      projectStructure,
      buildTools,
      packageManagers,
      totalFiles: files.length,
      analysisTime,
      accuracy: this.accuracyScore,
      detectionMethod: [...new Set(this.detectionMethods)],
      codeMetrics: this.codeMetrics,
      dependencies: this.dependencies,
      securityProfile: this.securityProfile,
      qualityScore: this.qualityScore
    };
  }

  /**
   * Calculate overall accuracy score
   */
  private calculateAccuracyScore(languages: LanguageInfo[], frameworks: FrameworkInfo[]): number {
    if (languages.length === 0) return 0;
    
    const avgLanguageConfidence = languages.reduce((sum, lang) => sum + lang.confidence, 0) / languages.length;
    const avgFrameworkConfidence = frameworks.length > 0 
      ? frameworks.reduce((sum, fw) => sum + fw.confidence, 0) / frameworks.length 
      : 0;
    
    const methodBonus = this.detectionMethods.includes('shebang') ? 10 : 
                      this.detectionMethods.includes('syntax') ? 5 : 0;
    
    return Math.min(100, avgLanguageConfidence * 0.7 + avgFrameworkConfidence * 0.2 + methodBonus);
  }

  /**
   * Calculate comprehensive code metrics
   */
  private calculateCodeMetrics(): CodeMetrics {
    let totalLines = 0;
    let codeLines = 0;
    let commentLines = 0;
    let blankLines = 0;
    let totalComplexity = 0;
    let duplicateLines = 0;

    for (const analysis of this.fileAnalyses) {
      if (!analysis.content) continue;
      
      const lines = analysis.content.split('\n');
      totalLines += lines.length;
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '') {
          blankLines++;
        } else if (this.isCommentLine(trimmed, analysis.language.name)) {
          commentLines++;
        } else {
          codeLines++;
        }
      }
      
      totalComplexity += this.calculateFileComplexity(analysis.content, analysis.language.name);
      duplicateLines += this.detectDuplicateLines(analysis.content);
    }

    const maintainabilityIndex = this.calculateMaintainabilityIndex(codeLines, totalComplexity, commentLines);
    const technicalDebt = this.calculateTechnicalDebt(totalComplexity, codeLines);
    const duplicatePercentage = totalLines > 0 ? (duplicateLines / totalLines) * 100 : 0;

    return {
      totalLines,
      codeLines,
      commentLines,
      blankLines,
      complexity: totalComplexity,
      maintainabilityIndex,
      technicalDebt,
      duplicateCodePercentage: Math.round(duplicatePercentage * 100) / 100
    };
  }

  private isCommentLine(line: string, language: string): boolean {
    const commentPatterns: Record<string, RegExp[]> = {
      javascript: [/^\/\//, /^\/\*/, /^\*/, /^\*\//],
      typescript: [/^\/\//, /^\/\*/, /^\*/, /^\*\//],
      python: [/^#/, /^"""/, /^'''/],
      java: [/^\/\//, /^\/\*/, /^\*/, /^\*\//],
      csharp: [/^\/\//, /^\/\*/, /^\*/, /^\*\//],
      php: [/^\/\//, /^#/, /^\/\*/, /^\*/, /^\*\//],
      ruby: [/^#/],
      go: [/^\/\//, /^\/\*/, /^\*/, /^\*\//],
      rust: [/^\/\//, /^\/\*/, /^\*/, /^\*\//],
      cpp: [/^\/\//, /^\/\*/, /^\*/, /^\*\//],
      c: [/^\/\//, /^\/\*/, /^\*/, /^\*\//],
      html: [/^<!--/, /^-->/],
      css: [/^\/\*/, /^\*/, /^\*\//],
      sql: [/^--/, /^\/\*/, /^\*/, /^\*\//]
    };

    const patterns = commentPatterns[language] || [];
    return patterns.some(pattern => pattern.test(line));
  }

  private calculateFileComplexity(content: string, language: string): number {
    const complexityPatterns: Record<string, RegExp[]> = {
      javascript: [/\bif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/, /\bcatch\b/, /\?.*:/, /&&/, /\|\|/],
      typescript: [/\bif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/, /\bcatch\b/, /\?.*:/, /&&/, /\|\|/],
      python: [/\bif\b/, /\belif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\btry\b/, /\bexcept\b/, /\band\b/, /\bor\b/],
      java: [/\bif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/, /\bcatch\b/, /\?.*:/, /&&/, /\|\|/],
      csharp: [/\bif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/, /\bcatch\b/, /\?.*:/, /&&/, /\|\|/],
      php: [/\bif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/, /\bcatch\b/, /\?.*:/, /&&/, /\|\|/],
      ruby: [/\bif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\bcase\b/, /\brescue\b/, /&&/, /\|\|/],
      go: [/\bif\b/, /\belse\b/, /\bfor\b/, /\bswitch\b/, /\bselect\b/, /&&/, /\|\|/],
      rust: [/\bif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\bmatch\b/, /&&/, /\|\|/]
    };

    const patterns = complexityPatterns[language] || complexityPatterns.javascript;
    let complexity = 1; // Base complexity
    
    patterns.forEach(pattern => {
      const matches = content.match(new RegExp(pattern.source, 'g'));
      if (matches) complexity += matches.length;
    });

    return complexity;
  }

  private detectDuplicateLines(content: string): number {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const lineCount = new Map<string, number>();
    
    lines.forEach(line => {
      lineCount.set(line, (lineCount.get(line) || 0) + 1);
    });
    
    let duplicates = 0;
    lineCount.forEach(count => {
      if (count > 1) duplicates += count - 1;
    });
    
    return duplicates;
  }

  private calculateMaintainabilityIndex(codeLines: number, complexity: number, commentLines: number): number {
    if (codeLines === 0) return 100;
    
    const volume = codeLines * Math.log2(codeLines + 1);
    const commentRatio = commentLines / (codeLines + commentLines);
    const complexityRatio = complexity / codeLines;
    
    const index = Math.max(0, 171 - 5.2 * Math.log(volume) - 0.23 * complexity - 16.2 * Math.log(codeLines) + 50 * Math.sin(Math.sqrt(2.4 * commentRatio)));
    
    return Math.min(100, Math.max(0, Math.round(index)));
  }

  private calculateTechnicalDebt(complexity: number, codeLines: number): string {
    if (codeLines === 0) return '0h';
    
    const complexityRatio = complexity / codeLines;
    const baseDebt = codeLines * 0.1; // 0.1 minutes per line base
    const complexityDebt = complexity * 2; // 2 minutes per complexity point
    
    const totalMinutes = baseDebt + complexityDebt;
    const hours = Math.round(totalMinutes / 60 * 100) / 100;
    
    if (hours < 1) return `${Math.round(totalMinutes)}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.round(hours / 24 * 10) / 10}d`;
  }

  /**
   * Enhanced file analysis with multiple detection methods
   */
  private analyzeFileEnhanced(filename: string, content: string): FileAnalysis {
    const extension = this.getFileExtension(filename);
    const language = this.detectFileLanguageEnhanced(filename, content);
    const encoding = this.detectEncoding(content);
    const lineCount = content.split('\n').length;
    const complexity = this.calculateFileComplexity(content, language.name);
    const maintainabilityIndex = this.calculateMaintainabilityIndex(
      content.split('\n').filter(line => line.trim().length > 0).length,
      complexity,
      content.split('\n').filter(line => this.isCommentLine(line.trim(), language.name)).length
    );
    const duplicateLines = this.detectDuplicateLines(content);
    const securityIssues = this.detectSecurityIssues(content, language.name);
    const documentation = this.calculateDocumentationScore(content, language.name);

    return {
      filename,
      extension,
      language,
      size: content.length,
      content,
      encoding,
      lineCount,
      complexity,
      maintainabilityIndex,
      duplicateLines,
      securityIssues,
      documentation
    };
  }

  private detectSecurityIssues(content: string, language: string): number {
    const securityPatterns: Record<string, RegExp[]> = {
      javascript: [/eval\s*\(/, /innerHTML\s*=/, /document\.write/, /setTimeout\s*\(\s*["'`]/, /new Function\s*\(/],
      typescript: [/eval\s*\(/, /innerHTML\s*=/, /document\.write/, /setTimeout\s*\(\s*["'`]/, /new Function\s*\(/],
      python: [/eval\s*\(/, /exec\s*\(/, /os\.system/, /subprocess\.call/, /pickle\.loads/],
      java: [/Runtime\.getRuntime\(\)\.exec/, /ProcessBuilder/, /Class\.forName/, /System\.getProperty/],
      php: [/eval\s*\(/, /system\s*\(/, /exec\s*\(/, /shell_exec/, /passthru/],
      csharp: [/Process\.Start/, /Assembly\.Load/, /Type\.GetType/, /Activator\.CreateInstance/]
    };

    const patterns = securityPatterns[language] || [];
    let issues = 0;
    
    patterns.forEach(pattern => {
      const matches = content.match(new RegExp(pattern.source, 'g'));
      if (matches) issues += matches.length;
    });
    
    return issues;
  }

  private calculateDocumentationScore(content: string, language: string): number {
    const lines = content.split('\n');
    const codeLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !this.isCommentLine(trimmed, language);
    }).length;
    
    const commentLines = lines.filter(line => this.isCommentLine(line.trim(), language)).length;
    
    if (codeLines === 0) return 100;
    
    const ratio = commentLines / codeLines;
    return Math.min(100, Math.round(ratio * 100));
  }

  /**
   * Detect file encoding
   */
  private detectEncoding(content: string): string {
    if (content.includes('\uFEFF')) return 'UTF-8-BOM';
    if (/[\u0080-\uFFFF]/.test(content)) return 'UTF-8';
    return 'ASCII';
  }

  /**
   * Analyze a single file to determine its language
   */
  private analyzeFile(filename: string, content: string): FileAnalysis {
    const extension = this.getFileExtension(filename);
    const language = this.detectFileLanguage(filename, content);

    return {
      filename,
      extension,
      language,
      size: content.length,
      content
    };
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot).toLowerCase() : '';
  }

  /**
   * Enhanced language detection with multiple methods
   */
  private detectFileLanguageEnhanced(filename: string, content: string): LanguageInfo {
    const extension = this.getFileExtension(filename);
    const candidates: Array<{ name: string; confidence: number; info: any; method: string }> = [];

    // Method 1: Extension-based detection
    this.addExtensionBasedCandidates(extension, candidates);

    // Method 2: Content pattern analysis
    if (content) {
      this.addPatternBasedCandidates(content, candidates);
      this.addKeywordBasedCandidates(content, candidates);
      this.addSyntaxBasedCandidates(content, candidates);
      this.addShebangBasedCandidates(content, candidates);
    }

    // Merge and weight candidates
    const mergedCandidates = this.mergeCandidates(candidates);
    mergedCandidates.sort((a, b) => b.confidence - a.confidence);

    if (mergedCandidates.length > 0) {
      const best = mergedCandidates[0];
      this.detectionMethods.push(best.method);
      
      return {
        name: best.name,
        confidence: best.confidence,
        extensions: best.info.extensions || [extension],
        category: best.info.category || 'data',
        ecosystem: best.info.ecosystem,
        version: best.info.version,
        dialect: best.info.dialect,
        features: best.info.features
      };
    }

    return {
      name: 'unknown',
      confidence: 0,
      extensions: [extension],
      category: 'data'
    };
  }

  private addExtensionBasedCandidates(extension: string, candidates: any[]) {
    for (const [langName, langInfo] of Object.entries(ENHANCED_LANGUAGE_PATTERNS)) {
      if (langInfo.extensions.includes(extension)) {
        candidates.push({
          name: langName,
          confidence: 70,
          info: langInfo,
          method: 'extension'
        });
      }
    }
  }

  private addPatternBasedCandidates(content: string, candidates: any[]) {
    for (const [langName, langInfo] of Object.entries(ENHANCED_LANGUAGE_PATTERNS)) {
      const matches = langInfo.patterns.filter(pattern => pattern.test(content)).length;
      if (matches > 0) {
        const confidence = Math.min(90, (matches / langInfo.patterns.length) * 100);
        candidates.push({
          name: langName,
          confidence,
          info: langInfo,
          method: 'pattern'
        });
      }
    }
  }

  private addKeywordBasedCandidates(content: string, candidates: any[]) {
    for (const [langName, langInfo] of Object.entries(ENHANCED_LANGUAGE_PATTERNS)) {
      const keywordMatches = langInfo.keywords.filter(keyword =>
        new RegExp(`\\b${keyword}\\b`, 'g').test(content)
      ).length;
      
      if (keywordMatches > 0) {
        const confidence = Math.min(80, (keywordMatches / langInfo.keywords.length) * 100);
        candidates.push({
          name: langName,
          confidence,
          info: langInfo,
          method: 'keyword'
        });
      }
    }
  }

  private addSyntaxBasedCandidates(content: string, candidates: any[]) {
    const lines = content.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    
    if (nonEmptyLines.length === 0) return;

    const syntaxPatterns = {
      javascript: /^\s*(const|let|var|function|class|import|export)\s/,
      typescript: /^\s*(interface|type|enum|namespace|declare)\s/,
      python: /^\s*(def|class|import|from)\s/,
      java: /^\s*(public|private|protected)\s+(class|interface|enum)/,
      csharp: /^\s*(public|private|protected)\s+(class|interface|struct)/,
      php: /^\s*(<\?php|class|function|namespace)/,
      ruby: /^\s*(def|class|module|require)/,
      go: /^\s*(package|import|func|type|var|const)/,
      rust: /^\s*(fn|struct|enum|impl|trait|use|mod)/,
      cpp: /^\s*(#include|class|struct|namespace|template)/,
      c: /^\s*(#include|int|char|float|double|void)\s/
    };

    for (const [lang, pattern] of Object.entries(syntaxPatterns)) {
      const matches = nonEmptyLines.filter(line => pattern.test(line)).length;
      if (matches > 0) {
        const confidence = Math.min(85, (matches / nonEmptyLines.length) * 100 * 2);
        const langInfo = ENHANCED_LANGUAGE_PATTERNS[lang as keyof typeof ENHANCED_LANGUAGE_PATTERNS];
        if (langInfo) {
          candidates.push({
            name: lang,
            confidence,
            info: langInfo,
            method: 'syntax'
          });
        }
      }
    }
  }

  private addShebangBasedCandidates(content: string, candidates: any[]) {
    const firstLine = content.split('\n')[0];
    if (firstLine.startsWith('#!')) {
      const shebangMappings = {
        'python': /python[0-9.]*$/,
        'bash': /(bash|sh)$/,
        'ruby': /ruby$/,
        'javascript': /node$/,
        'php': /php$/
      };

      for (const [lang, pattern] of Object.entries(shebangMappings)) {
        if (pattern.test(firstLine)) {
          const langInfo = ENHANCED_LANGUAGE_PATTERNS[lang as keyof typeof ENHANCED_LANGUAGE_PATTERNS];
          if (langInfo) {
            candidates.push({
              name: lang,
              confidence: 95,
              info: langInfo,
              method: 'shebang'
            });
          }
        }
      }
    }
  }

  private mergeCandidates(candidates: any[]): any[] {
    const merged = new Map();
    
    for (const candidate of candidates) {
      const existing = merged.get(candidate.name);
      if (existing) {
        const methodWeights = { shebang: 1.0, extension: 0.8, syntax: 0.9, pattern: 0.7, keyword: 0.6 };
        const weight = methodWeights[candidate.method as keyof typeof methodWeights] || 0.5;
        
        existing.confidence = Math.max(existing.confidence, candidate.confidence * weight);
        existing.method += `,${candidate.method}`;
      } else {
        merged.set(candidate.name, { ...candidate });
      }
    }
    
    return Array.from(merged.values());
  }

  /**
   * Detect language for a single file
   */
  private detectFileLanguage(filename: string, content: string): LanguageInfo {
    const extension = this.getFileExtension(filename);
    const candidates: Array<{ name: string; confidence: number; info: Record<string, unknown> }> = [];

    // Check each language pattern
    for (const [langName, langInfo] of Object.entries(ENHANCED_LANGUAGE_PATTERNS)) {
      let confidence = 0;

      // Extension match (high confidence)
      if (langInfo.extensions.includes(extension)) {
        confidence += 60;
      }

      // Content pattern matching
      if (content) {
        const patternMatches = langInfo.patterns.filter(pattern => pattern.test(content)).length;
        const patternConfidence = (patternMatches / langInfo.patterns.length) * 30;
        confidence += patternConfidence;

        // Keyword frequency analysis
        const keywordMatches = langInfo.keywords.filter(keyword =>
          new RegExp(`\\b${keyword}\\b`, 'g').test(content)
        ).length;
        const keywordConfidence = (keywordMatches / langInfo.keywords.length) * 10;
        confidence += keywordConfidence;
      }

      if (confidence > 0) {
        candidates.push({
          name: langName,
          confidence: Math.min(100, confidence),
          info: langInfo
        });
      }
    }

    // Sort by confidence and return the best match
    candidates.sort((a, b) => b.confidence - a.confidence);

    if (candidates.length > 0) {
      const best = candidates[0];
      return {
        name: best.name,
        confidence: best.confidence,
        extensions: best.info.extensions as string[],
        category: best.info.category as 'programming' | 'markup' | 'config' | 'data' | 'documentation',
        ecosystem: best.info.ecosystem as string | undefined
      };
    }

    // Default fallback
    return {
      name: 'unknown',
      confidence: 0,
      extensions: [extension],
      category: 'data'
    };
  }

  /**
   * Detect all languages in the codebase
   */
  private detectLanguages(): LanguageInfo[] {
    const languageMap = new Map<string, { totalSize: number; fileCount: number; maxConfidence: number; info: LanguageInfo }>();

    // Aggregate language statistics
    for (const analysis of this.fileAnalyses) {
      const lang = analysis.language;
      if (lang.name === 'unknown') continue;

      const existing = languageMap.get(lang.name);
      if (existing) {
        existing.totalSize += analysis.size;
        existing.fileCount += 1;
        existing.maxConfidence = Math.max(existing.maxConfidence, lang.confidence);
      } else {
        languageMap.set(lang.name, {
          totalSize: analysis.size,
          fileCount: 1,
          maxConfidence: lang.confidence,
          info: lang
        });
      }
    }

    // Calculate final confidence scores
    const totalFiles = this.fileAnalyses.length;
    const totalSize = this.fileAnalyses.reduce((sum, analysis) => sum + analysis.size, 0);

    const languages: LanguageInfo[] = [];
    for (const [name, stats] of languageMap.entries()) {
      const fileRatio = stats.fileCount / totalFiles;
      const sizeRatio = stats.totalSize / totalSize;
      const finalConfidence = Math.round(
        (stats.maxConfidence * 0.4) +
        (fileRatio * 100 * 0.3) +
        (sizeRatio * 100 * 0.3)
      );

      languages.push({
        ...stats.info,
        confidence: Math.min(100, finalConfidence)
      });
    }

    return languages.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Determine the primary language
   */
  private determinePrimaryLanguage(languages: LanguageInfo[]): LanguageInfo {
    if (languages.length === 0) {
      return {
        name: 'unknown',
        confidence: 0,
        extensions: [],
        category: 'data'
      };
    }

    return languages[0];
  }

  /**
   * Detect build tools from filenames
   */
  private detectBuildTools(): string[] {
    const buildTools: string[] = [];
    const filenames = this.fileAnalyses.map(f => f.filename.toLowerCase());

    const buildToolPatterns = {
      'Webpack': ['webpack.config.js', 'webpack.config.ts', 'webpack.dev.js', 'webpack.prod.js'],
      'Vite': ['vite.config.js', 'vite.config.ts'],
      'Rollup': ['rollup.config.js', 'rollup.config.ts'],
      'Parcel': ['parcel.config.js', '.parcelrc'],
      'Gulp': ['gulpfile.js', 'gulpfile.ts'],
      'Grunt': ['gruntfile.js', 'grunt.js'],
      'Maven': ['pom.xml'],
      'Gradle': ['build.gradle', 'build.gradle.kts', 'gradle.properties'],
      'Make': ['makefile', 'cmake.txt', 'cmakelist.txt'],
      'Cargo': ['cargo.toml'],
      'Go Modules': ['go.mod', 'go.sum'],
      'CMake': ['cmakelists.txt', 'cmake.txt']
    };

    for (const [tool, patterns] of Object.entries(buildToolPatterns)) {
      if (patterns.some(pattern => filenames.some(filename => filename.includes(pattern)))) {
        buildTools.push(tool);
      }
    }

    return buildTools;
  }

  /**
   * Detect package managers from filenames
   */
  private detectPackageManagers(): string[] {
    const packageManagers: string[] = [];
    const filenames = this.fileAnalyses.map(f => f.filename.toLowerCase());

    const packageManagerPatterns = {
      'npm': ['package.json', 'package-lock.json'],
      'Yarn': ['yarn.lock', '.yarnrc'],
      'pnpm': ['pnpm-lock.yaml', '.pnpmrc'],
      'Bun': ['bun.lockb'],
      'pip': ['requirements.txt', 'pyproject.toml', 'setup.py'],
      'Poetry': ['poetry.lock', 'pyproject.toml'],
      'Conda': ['environment.yml', 'conda.yml'],
      'Composer': ['composer.json', 'composer.lock'],
      'Bundler': ['gemfile', 'gemfile.lock'],
      'Cargo': ['cargo.toml', 'cargo.lock'],
      'Go Modules': ['go.mod', 'go.sum'],
      'NuGet': ['packages.config', '*.csproj', '*.nuspec']
    };

    for (const [manager, patterns] of Object.entries(packageManagerPatterns)) {
      if (patterns.some(pattern =>
        filenames.some(filename =>
          pattern.includes('*') ?
            new RegExp(pattern.replace('*', '.*')).test(filename) :
            filename.includes(pattern)
        )
      )) {
        packageManagers.push(manager);
      }
    }

    return packageManagers;
  }

  /**
   * Detect frameworks based on file patterns and content
   */
  private detectFrameworks(): FrameworkInfo[] {
    const frameworks: FrameworkInfo[] = [];
    const filenames = this.fileAnalyses.map(f => f.filename.toLowerCase());
    const allContent = this.fileAnalyses.map(f => f.content || '').join('\n');

    // Frontend Frameworks
    this.detectReactFramework(filenames, allContent, frameworks);
    this.detectVueFramework(filenames, allContent, frameworks);
    this.detectAngularFramework(filenames, allContent, frameworks);
    this.detectSvelteFramework(filenames, allContent, frameworks);

    // Backend Frameworks
    this.detectNodeFrameworks(filenames, allContent, frameworks);
    this.detectPythonFrameworks(filenames, allContent, frameworks);
    this.detectJavaFrameworks(filenames, allContent, frameworks);
    this.detectPHPFrameworks(filenames, allContent, frameworks);

    // Mobile Frameworks
    this.detectMobileFrameworks(filenames, allContent, frameworks);

    return frameworks.sort((a, b) => b.confidence - a.confidence);
  }

  private detectReactFramework(filenames: string[], content: string, frameworks: FrameworkInfo[]): void {
    let confidence = 0;
    const dependencies: string[] = [];
    const configFiles: string[] = [];

    // Enhanced file pattern detection
    if (filenames.some(f => f.includes('.jsx') || f.includes('.tsx'))) {
      confidence += 35;
      configFiles.push('JSX/TSX files');
    }
    
    // Package.json analysis
    if (filenames.some(f => f.includes('package.json'))) {
      if (content.includes('"react"')) {
        confidence += 45;
        dependencies.push('react');
      }
      if (content.includes('"@types/react"')) {
        confidence += 15;
        dependencies.push('@types/react');
      }
      if (content.includes('"react-dom"')) {
        confidence += 20;
        dependencies.push('react-dom');
      }
    }

    // Enhanced content pattern analysis
    const reactPatterns = [
      /import\s+React.*from\s+['"]react['"]/g,
      /import\s+\{[^}]*\}\s+from\s+['"]react['"]/g,
      /React\.(Component|PureComponent|memo|forwardRef)/g,
      /useState|useEffect|useContext|useReducer|useMemo|useCallback/g,
      /JSX\.Element|React\.FC|React\.FunctionComponent/g,
      /className=|onClick=|onChange=|onSubmit=/g,
      /<\w+[^>]*>/g
    ];

    let patternMatches = 0;
    reactPatterns.forEach(pattern => {
      const matches = (content.match(pattern) || []).length;
      patternMatches += matches;
    });

    confidence += Math.min(30, patternMatches * 2);

    if (confidence > 60) {
      frameworks.push({
        name: 'React',
        language: filenames.some(f => f.includes('.tsx')) ? 'typescript' : 'javascript',
        confidence: Math.min(100, confidence),
        category: 'frontend',
        ecosystem: 'web',
        dependencies,
        configFiles
      });
    }

    // Enhanced Next.js detection
    const nextjsIndicators = [
      filenames.some(f => f.includes('next.config')),
      content.includes('next/'),
      content.includes('getServerSideProps'),
      content.includes('getStaticProps'),
      content.includes('getStaticPaths'),
      filenames.some(f => f.includes('pages/') || f.includes('app/')),
      content.includes('next/router') || content.includes('next/navigation')
    ];

    const nextjsScore = nextjsIndicators.filter(Boolean).length;
    if (nextjsScore >= 2) {
      frameworks.push({
        name: 'Next.js',
        language: filenames.some(f => f.includes('.tsx')) ? 'typescript' : 'javascript',
        confidence: Math.min(100, confidence + nextjsScore * 15),
        category: 'fullstack',
        ecosystem: 'web',
        dependencies: [...dependencies, 'next'],
        configFiles: [...configFiles, 'next.config.js']
      });
    }
  }

  private detectVueFramework(filenames: string[], content: string, frameworks: FrameworkInfo[]): void {
    let confidence = 0;

    if (filenames.some(f => f.includes('.vue'))) confidence += 40;
    if (content.includes('"vue"') || content.includes('@vue/')) confidence += 30;
    if (/import.*from\s+['"]vue['"]/.test(content)) confidence += 20;
    if (/<template>|<script>|<style>/.test(content)) confidence += 20;

    if (confidence > 50) {
      frameworks.push({
        name: 'Vue.js',
        language: 'javascript',
        confidence: Math.min(100, confidence),
        category: 'frontend',
        ecosystem: 'web'
      });
    }

    // Nuxt.js detection
    if (filenames.some(f => f.includes('nuxt.config')) || content.includes('nuxt')) {
      frameworks.push({
        name: 'Nuxt.js',
        language: 'javascript',
        confidence: Math.min(100, confidence + 20),
        category: 'fullstack',
        ecosystem: 'web'
      });
    }
  }

  private detectAngularFramework(filenames: string[], content: string, frameworks: FrameworkInfo[]): void {
    let confidence = 0;

    if (filenames.some(f => f.includes('angular.json'))) confidence += 40;
    if (content.includes('@angular/')) confidence += 30;
    if (/@Component|@Injectable|@NgModule/.test(content)) confidence += 30;
    if (filenames.some(f => f.includes('.component.ts') || f.includes('.service.ts'))) confidence += 20;

    if (confidence > 50) {
      frameworks.push({
        name: 'Angular',
        language: 'typescript',
        confidence: Math.min(100, confidence),
        category: 'frontend',
        ecosystem: 'web'
      });
    }
  }

  private detectSvelteFramework(filenames: string[], content: string, frameworks: FrameworkInfo[]): void {
    let confidence = 0;

    if (filenames.some(f => f.includes('.svelte'))) confidence += 40;
    if (content.includes('"svelte"') || content.includes('svelte/')) confidence += 30;
    if (filenames.some(f => f.includes('svelte.config'))) confidence += 20;

    if (confidence > 50) {
      frameworks.push({
        name: 'Svelte',
        language: 'javascript',
        confidence: Math.min(100, confidence),
        category: 'frontend',
        ecosystem: 'web'
      });
    }

    // SvelteKit detection
    if (content.includes('@sveltejs/kit') || filenames.some(f => f.includes('app.html'))) {
      frameworks.push({
        name: 'SvelteKit',
        language: 'javascript',
        confidence: Math.min(100, confidence + 20),
        category: 'fullstack',
        ecosystem: 'web'
      });
    }
  }

  private detectNodeFrameworks(filenames: string[], content: string, frameworks: FrameworkInfo[]): void {
    // Express.js
    if (content.includes('express') && (content.includes('app.listen') || content.includes('app.get'))) {
      frameworks.push({
        name: 'Express.js',
        language: 'javascript',
        confidence: 85,
        category: 'backend',
        ecosystem: 'web'
      });
    }

    // Fastify
    if (content.includes('fastify') || content.includes('@fastify/')) {
      frameworks.push({
        name: 'Fastify',
        language: 'javascript',
        confidence: 80,
        category: 'backend',
        ecosystem: 'web'
      });
    }

    // NestJS
    if (content.includes('@nestjs/') || /@Controller|@Injectable|@Module/.test(content)) {
      frameworks.push({
        name: 'NestJS',
        language: 'typescript',
        confidence: 85,
        category: 'backend',
        ecosystem: 'web'
      });
    }
  }

  private detectPythonFrameworks(filenames: string[], content: string, frameworks: FrameworkInfo[]): void {
    // Django
    if (content.includes('django') || filenames.some(f => f.includes('manage.py') || f.includes('settings.py'))) {
      frameworks.push({
        name: 'Django',
        language: 'python',
        confidence: 85,
        category: 'fullstack',
        ecosystem: 'web'
      });
    }

    // Flask
    if (content.includes('from flask import') || content.includes('Flask(__name__)')) {
      frameworks.push({
        name: 'Flask',
        language: 'python',
        confidence: 85,
        category: 'backend',
        ecosystem: 'web'
      });
    }

    // FastAPI
    if (content.includes('fastapi') || content.includes('from fastapi import')) {
      frameworks.push({
        name: 'FastAPI',
        language: 'python',
        confidence: 85,
        category: 'backend',
        ecosystem: 'web'
      });
    }
  }

  private detectJavaFrameworks(filenames: string[], content: string, frameworks: FrameworkInfo[]): void {
    // Spring Boot
    if (content.includes('@SpringBootApplication') || content.includes('spring-boot')) {
      frameworks.push({
        name: 'Spring Boot',
        language: 'java',
        confidence: 90,
        category: 'backend',
        ecosystem: 'web'
      });
    }

    // Spring Framework
    if (content.includes('@Controller') || content.includes('@Service') || content.includes('springframework')) {
      frameworks.push({
        name: 'Spring Framework',
        language: 'java',
        confidence: 85,
        category: 'backend',
        ecosystem: 'web'
      });
    }
  }

  private detectPHPFrameworks(filenames: string[], content: string, frameworks: FrameworkInfo[]): void {
    // Laravel
    if (content.includes('Illuminate\\') || filenames.some(f => f.includes('artisan'))) {
      frameworks.push({
        name: 'Laravel',
        language: 'php',
        confidence: 85,
        category: 'fullstack',
        ecosystem: 'web'
      });
    }

    // Symfony
    if (content.includes('Symfony\\') || filenames.some(f => f.includes('symfony.lock'))) {
      frameworks.push({
        name: 'Symfony',
        language: 'php',
        confidence: 85,
        category: 'fullstack',
        ecosystem: 'web'
      });
    }
  }

  private detectMobileFrameworks(filenames: string[], content: string, frameworks: FrameworkInfo[]): void {
    // React Native
    if (content.includes('react-native') || content.includes('@react-native/')) {
      frameworks.push({
        name: 'React Native',
        language: 'javascript',
        confidence: 90,
        category: 'mobile',
        ecosystem: 'mobile'
      });
    }

    // Flutter
    if (content.includes('flutter') || filenames.some(f => f.includes('pubspec.yaml'))) {
      frameworks.push({
        name: 'Flutter',
        language: 'dart',
        confidence: 90,
        category: 'mobile',
        ecosystem: 'mobile'
      });
    }

    // Ionic
    if (content.includes('@ionic/') || content.includes('ionic-angular')) {
      frameworks.push({
        name: 'Ionic',
        language: 'javascript',
        confidence: 85,
        category: 'mobile',
        ecosystem: 'mobile'
      });
    }
  }

  /**
   * Analyze project structure and determine project type
   */
  private analyzeProjectStructure(): ProjectStructure {
    const filenames = this.fileAnalyses.map(f => f.filename.toLowerCase());
    const directories = new Set<string>();

    // Extract directory structure
    filenames.forEach(filename => {
      const parts = filename.split('/');
      for (let i = 1; i < parts.length; i++) {
        directories.add(parts.slice(0, i).join('/'));
      }
    });

    const indicators: string[] = [];
    let projectType: ProjectStructure['type'] = 'unknown';
    let confidence = 0;

    // Web application indicators
    if (this.hasWebStructure(filenames, directories)) {
      projectType = 'web';
      confidence += 40;
      indicators.push('Web application structure detected');
    }

    // Mobile application indicators
    if (this.hasMobileStructure(filenames, directories)) {
      projectType = 'mobile';
      confidence += 40;
      indicators.push('Mobile application structure detected');
    }

    // Library/package indicators
    if (this.hasLibraryStructure(filenames, directories)) {
      projectType = 'library';
      confidence += 35;
      indicators.push('Library/package structure detected');
    }

    // Microservice indicators
    if (this.hasMicroserviceStructure(filenames, directories)) {
      projectType = 'microservice';
      confidence += 35;
      indicators.push('Microservice structure detected');
    }

    // Monorepo indicators
    if (this.hasMonorepoStructure(filenames, directories)) {
      projectType = 'monorepo';
      confidence += 30;
      indicators.push('Monorepo structure detected');
    }

    // Desktop application indicators
    if (this.hasDesktopStructure(filenames, directories)) {
      projectType = 'desktop';
      confidence += 30;
      indicators.push('Desktop application structure detected');
    }

    return {
      type: projectType,
      confidence: Math.min(100, confidence),
      indicators
    };
  }

  private hasWebStructure(filenames: string[], directories: Set<string>): boolean {
    const webIndicators = [
      'public/', 'static/', 'assets/',
      'src/components/', 'src/pages/', 'src/views/',
      'index.html', 'app.html',
      'package.json'
    ];

    return webIndicators.some(indicator =>
      filenames.some(f => f.includes(indicator)) ||
      directories.has(indicator.replace('/', ''))
    );
  }

  private hasMobileStructure(filenames: string[], directories: Set<string>): boolean {
    const mobileIndicators = [
      'android/', 'ios/', 'lib/',
      'pubspec.yaml', 'android/app/',
      'ios/runner/', 'react-native',
      'metro.config.js', 'app.json'
    ];

    return mobileIndicators.some(indicator =>
      filenames.some(f => f.includes(indicator)) ||
      directories.has(indicator.replace('/', ''))
    );
  }

  private hasLibraryStructure(filenames: string[], directories: Set<string>): boolean {
    const libraryIndicators = [
      'lib/', 'dist/', 'build/',
      'index.js', 'index.ts',
      'rollup.config', 'webpack.config',
      'tsconfig.json', '.npmignore'
    ];

    const hasMainEntry = filenames.some(f =>
      f === 'index.js' || f === 'index.ts' || f === 'main.js' || f === 'main.ts'
    );

    const hasConfigFiles = libraryIndicators.some(indicator =>
      filenames.some(f => f.includes(indicator))
    );

    return hasMainEntry && hasConfigFiles;
  }

  private hasMicroserviceStructure(filenames: string[], directories: Set<string>): boolean {
    const microserviceIndicators = [
      'dockerfile', 'docker-compose',
      'kubernetes/', 'k8s/',
      'helm/', 'charts/',
      'api/', 'routes/', 'controllers/',
      'middleware/', 'services/'
    ];

    const hasContainerization = filenames.some(f =>
      f.includes('dockerfile') || f.includes('docker-compose')
    );

    const hasApiStructure = microserviceIndicators.some(indicator =>
      filenames.some(f => f.includes(indicator)) ||
      directories.has(indicator.replace('/', ''))
    );

    return hasContainerization || hasApiStructure;
  }

  private hasMonorepoStructure(filenames: string[], directories: Set<string>): boolean {
    const monorepoIndicators = [
      'packages/', 'apps/', 'libs/',
      'lerna.json', 'nx.json',
      'workspace.json', 'rush.json',
      'pnpm-workspace.yaml'
    ];

    const hasWorkspaceConfig = filenames.some(f =>
      f.includes('lerna.json') || f.includes('nx.json') ||
      f.includes('workspace.json') || f.includes('pnpm-workspace.yaml')
    );

    const hasMultiplePackages = Array.from(directories).filter(dir =>
      dir.includes('packages/') || dir.includes('apps/') || dir.includes('libs/')
    ).length > 1;

    return hasWorkspaceConfig || hasMultiplePackages;
  }

  private hasDesktopStructure(filenames: string[], directories: Set<string>): boolean {
    const desktopIndicators = [
      'electron', 'tauri',
      'main.js', 'main.ts',
      'src-tauri/', 'electron-builder',
      'forge.config.js', 'tauri.conf.json'
    ];

    return desktopIndicators.some(indicator =>
      filenames.some(f => f.includes(indicator)) ||
      directories.has(indicator.replace('/', ''))
    );
  }

  /**
   * Get a summary of detected languages for quick reference
   */
  public getLanguageSummary(result: DetectionResult): string {
    const { primaryLanguage, allLanguages, frameworks } = result;

    let summary = `Primary: ${primaryLanguage.name} (${primaryLanguage.confidence}%)`;

    if (allLanguages.length > 1) {
      const others = allLanguages.slice(1, 3).map(lang => `${lang.name} (${lang.confidence}%)`);
      summary += `, Others: ${others.join(', ')}`;
    }

    if (frameworks.length > 0) {
      const topFrameworks = frameworks.slice(0, 2).map(fw => fw.name);
      summary += `, Frameworks: ${topFrameworks.join(', ')}`;
    }

    return summary;
  }

  /**
   * Get recommended analysis tools based on detected languages and frameworks
   */
  public getRecommendedTools(result: DetectionResult): string[] {
    const tools = new Set<string>();

    // Language-specific tools
    result.allLanguages.forEach(lang => {
      switch (lang.name) {
        case 'javascript':
        case 'typescript':
          tools.add('ESLint');
          tools.add('SonarJS');
          break;
        case 'python':
          tools.add('Bandit');
          tools.add('PyLint');
          tools.add('Safety');
          break;
        case 'java':
          tools.add('SpotBugs');
          tools.add('SonarJava');
          break;
        case 'csharp':
          tools.add('SonarC#');
          tools.add('Security Code Scan');
          break;
        case 'php':
          tools.add('PHPCS Security');
          tools.add('SonarPHP');
          break;
        case 'ruby':
          tools.add('Brakeman');
          tools.add('RuboCop Security');
          break;
        case 'go':
          tools.add('Gosec');
          tools.add('StaticCheck');
          break;
        case 'rust':
          tools.add('Clippy');
          tools.add('Cargo Audit');
          break;
      }
    });

    // Framework-specific tools
    result.frameworks.forEach(framework => {
      switch (framework.name) {
        case 'React':
        case 'Next.js':
          tools.add('React Security');
          tools.add('JSX A11y');
          break;
        case 'Angular':
          tools.add('Angular Security');
          tools.add('TSLint Security');
          break;
        case 'Vue.js':
          tools.add('Vue Security');
          break;
        case 'Django':
          tools.add('Django Security');
          tools.add('Bandit Django');
          break;
        case 'Spring Boot':
          tools.add('Spring Security Analyzer');
          break;
      }
    });

    // Universal tools
    tools.add('Semgrep');
    tools.add('CodeQL');
    tools.add('Secret Scanner');

    return Array.from(tools);
  }

  /**
   * Analyze project dependencies
   */
  private analyzeDependencies(): DependencyInfo[] {
    const dependencies: DependencyInfo[] = [];
    const packageJsonFiles = this.fileAnalyses.filter(f => f.filename.toLowerCase().includes('package.json'));
    
    packageJsonFiles.forEach(file => {
      if (!file.content) return;
      
      try {
        const pkg = JSON.parse(file.content);
        
        // Production dependencies
        if (pkg.dependencies) {
          Object.entries(pkg.dependencies).forEach(([name, version]) => {
            dependencies.push({
              name,
              version: version as string,
              type: 'production',
              ecosystem: 'npm'
            });
          });
        }
        
        // Development dependencies
        if (pkg.devDependencies) {
          Object.entries(pkg.devDependencies).forEach(([name, version]) => {
            dependencies.push({
              name,
              version: version as string,
              type: 'development',
              ecosystem: 'npm'
            });
          });
        }
      } catch (e) {
        // Invalid JSON, skip
      }
    });
    
    return dependencies;
  }

  /**
   * Analyze security profile
   */
  private analyzeSecurityProfile(): SecurityProfile {
    let totalSecurityIssues = 0;
    const vulnerablePatterns: string[] = [];
    const securityFeatures: string[] = [];
    
    this.fileAnalyses.forEach(analysis => {
      if (analysis.securityIssues) {
        totalSecurityIssues += analysis.securityIssues;
      }
    });
    
    // Detect security features
    const allContent = this.fileAnalyses.map(f => f.content || '').join('\n');
    
    if (/helmet|cors|csrf|xss|sanitize/i.test(allContent)) {
      securityFeatures.push('Security middleware detected');
    }
    
    if (/bcrypt|scrypt|argon2/i.test(allContent)) {
      securityFeatures.push('Secure password hashing');
    }
    
    if (/jwt|oauth|passport/i.test(allContent)) {
      securityFeatures.push('Authentication framework');
    }
    
    if (/https|ssl|tls/i.test(allContent)) {
      securityFeatures.push('Secure communication');
    }
    
    // Determine risk level
    const riskLevel = totalSecurityIssues > 10 ? 'critical' :
                     totalSecurityIssues > 5 ? 'high' :
                     totalSecurityIssues > 2 ? 'medium' : 'low';
    
    const complianceLevel = Math.max(0, 100 - (totalSecurityIssues * 5));
    
    const recommendations: string[] = [];
    if (totalSecurityIssues > 0) {
      recommendations.push('Review and fix security vulnerabilities');
    }
    if (securityFeatures.length === 0) {
      recommendations.push('Implement security best practices');
    }
    
    return {
      riskLevel,
      vulnerablePatterns,
      securityFeatures,
      complianceLevel,
      recommendations
    };
  }

  /**
   * Calculate overall quality score
   */
  private calculateQualityScore(): number {
    const metrics = this.codeMetrics;
    const security = this.securityProfile;
    
    // Maintainability (40%)
    const maintainabilityScore = metrics.maintainabilityIndex;
    
    // Security (30%)
    const securityScore = security.complianceLevel;
    
    // Documentation (20%)
    const avgDocumentation = this.fileAnalyses.length > 0 ?
      this.fileAnalyses.reduce((sum, f) => sum + (f.documentation || 0), 0) / this.fileAnalyses.length : 0;
    
    // Code duplication penalty (10%)
    const duplicationPenalty = Math.min(50, metrics.duplicateCodePercentage * 2);
    const duplicationScore = 100 - duplicationPenalty;
    
    const qualityScore = (
      maintainabilityScore * 0.4 +
      securityScore * 0.3 +
      avgDocumentation * 0.2 +
      duplicationScore * 0.1
    );
    
    return Math.round(qualityScore);
  }
}
