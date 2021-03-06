/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-any",
        description: "Disallows usages of `any` as a type declaration.",
        hasFix: true,
        rationale: "Using `any` as a type declaration nullifies the compile-time benefits of the type system.",
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "typescript",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    // tslint:disable-next-line prefer-template (fixed in 5.3)
    public static FAILURE_STRING = "Type declaration of 'any' loses type-safety. " +
        "Consider replacing it with a more precise type, the empty type ('{}'), " +
        "or suppress this occurrence.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.AnyKeyword) {
            const start = node.end - 3;
            return ctx.addFailure(start, node.end, Rule.FAILURE_STRING, new Lint.Replacement(start, 3, "{}"));
        }
        return ts.forEachChild(node, cb);
    });
}
